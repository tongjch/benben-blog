## ClassPathXmlApplicationContext简介

### 一、使用说明

​	想要深入了解ClassPathXmlApplicationContext源码，首先要做的第一件事就是知道如何去使用它。

1. 写一个简单的java代码

   ```java
   public class UserController {
     private UserService userService;
     public Object queryById(Long id) {
       return this.userService.queryByUserId(id);
     }
     public void setUserService(UserService userService) {
       this.userService = userService;
     }
   }
   
   public class UserService {
     public Object queryByUserId(Long id) {
       return new Object();
     }
   }
   ```

2. 配置applicationContext.xml文件并放入classpath下面

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <beans xmlns="http://www.springframework.org/schema/beans"
   	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
   	xsi:schemaLocation="http://www.springframework.org/schema/beans
           http://www.springframework.org/schema/beans/spring-beans.xsd ">
   	<!--定义了一个ID为userService的bean，其中bean的类型为com.focustech.spring.UserService  -->
   	<bean id="userService" class="com.focustech.spring.UserService"></bean>
   	<!--定义了一个ID为userController的bean，bean的类型为com.focustech.test.spring.UserController  -->
   	<!-- 其中这个bean有一个属性userService引用了一个ID为userService的Bean -->
   	<bean id="userController" class="com.focustech.test.spring.UserController">
   		<property name="userService" ref="userService" />
   	</bean>
   </beans>
   ```

3. 启动Spring容器

   ```java
   public class SpringTest {
     public static void main(String[] args) {
       ClassPathXmlApplicationContext context =
           new ClassPathXmlApplicationContext("applicationContext.xml");
       UserController userController = context.getBean(UserController.class);
       System.out.println(userController.queryById(1L));
       context.close();
     }
   }
   ```

### 二、ClassPathXmlApplicationContext容器启动

​	ClassPathXmlApplicationContext内部封装了很多构造方法，对我们看代码比较有用的就是下面这个。

```java
public ClassPathXmlApplicationContext(String[] configLocations, boolean refresh, ApplicationContext parent)
			throws BeansException {
		super(parent);
		setConfigLocations(configLocations);
		if (refresh) {
			refresh();
		}
	}
```

​	通过上面代码，我们可以看到ClassPathXmlApplicationContext容器的启动可以分为三个步骤。

1. 设置当前容器的父容器，一般情况下为null，如果有父容器存在，子容器可以获取到父容器中的bean而父容器无法获取子容器中的bean。
2. 设置当前容器xml文件（Resource资源）的位置
3. 如果当前容器没有刷新,就刷新当前容器

### 三、setConfigLocations做了什么

​	打开setConfigLocations方法的代码可以知道这个方法里面只做了一件事情那就是解析每个location的路径,代码如下：

```java
for (int i = 0; i < locations.length; i++) {
    this.configLocations[i] = resolvePath(locations[i]).trim();
}
```

```java
protected String resolvePath(String path) {
	return getEnvironment().resolveRequiredPlaceholders(path);
}
```

​	在解析是容器先获取了容器的运行环境（什么是容器运行环境将会在下一节进行介绍,本章中只需要了解到这个运行环境中包含了系统配置，启动参数等等），然后再解析路径字符串将字符串中${xxx}解析成响应的数据,如下例子:

```
比如你的location的为${user.dir}/applicationContext.xml此时将会被解析成D:/code/workspace/test/applicationContext.xml
```



### 四、refresh做了什么

​	refresh方法定义于类AbstractApplicationContext，该方法定义了Spring容器刷新需要做的的事情。

```java
public void refresh() throws BeansException, IllegalStateException {
		synchronized (this.startupShutdownMonitor) {
			// Prepare this context for refreshing.
			prepareRefresh();

			// Tell the subclass to refresh the internal bean factory.
			ConfigurableListableBeanFactory beanFactory = obtainFreshBeanFactory();

			// Prepare the bean factory for use in this context.
			prepareBeanFactory(beanFactory);

			try {
				// Allows post-processing of the bean factory in context subclasses.
				postProcessBeanFactory(beanFactory);

				// Invoke factory processors registered as beans in the context.
				invokeBeanFactoryPostProcessors(beanFactory);

				// Register bean processors that intercept bean creation.
				registerBeanPostProcessors(beanFactory);

				// Initialize message source for this context.
				initMessageSource();

				// Initialize event multicaster for this context.
				initApplicationEventMulticaster();

				// Initialize other special beans in specific context subclasses.
				onRefresh();

				// Check for listener beans and register them.
				registerListeners();

				// Instantiate all remaining (non-lazy-init) singletons.
				finishBeanFactoryInitialization(beanFactory);

				// Last step: publish corresponding event.
				finishRefresh();
			}

			catch (BeansException ex) {
				if (logger.isWarnEnabled()) {
					logger.warn("Exception encountered during context initialization - " +
							"cancelling refresh attempt: " + ex);
				}

				// Destroy already created singletons to avoid dangling resources.
				destroyBeans();

				// Reset 'active' flag.
				cancelRefresh(ex);

				// Propagate exception to caller.
				throw ex;
			}

			finally {
				// Reset common introspection caches in Spring's core, since we
				// might not ever need metadata for singleton beans anymore...
				resetCommonCaches();
			}
		}
	}
```

1. prepareRefresh刷新前的准备，里面的内容很简单没啥可看的,里面给子类预留了一个接口initPropertySources用于在校验require属性前初始化子类需要的属性环境

   ```java
   protected void prepareRefresh() {
   		this.startupDate = System.currentTimeMillis();
   		this.closed.set(false);
   		this.active.set(true);
   
   		if (logger.isInfoEnabled()) {
   			logger.info("Refreshing " + this);
   		}
   
   		// Initialize any placeholder property sources in the context environment
   		initPropertySources();
   
   		// Validate that all properties marked as required are resolvable
   		// see ConfigurablePropertyResolver#setRequiredProperties
   		getEnvironment().validateRequiredProperties();
   
   		// Allow for the collection of early ApplicationEvents,
   		// to be published once the multicaster is available...
   		this.earlyApplicationEvents = new LinkedHashSet<ApplicationEvent>();
   	}
   
   	protected void initPropertySources() {
   		// For subclasses: do nothing by default.
   	}
   ```

2. obtainFreshBeanFactory创建并获取BeanFactory（DefaultListableBeanFactory）对象并从XML文件中加载所有的Bean定义信息注册入BeanFactory中。

   ```java
   protected ConfigurableListableBeanFactory obtainFreshBeanFactory() {
   		refreshBeanFactory();
   		ConfigurableListableBeanFactory beanFactory = getBeanFactory();
   		if (logger.isDebugEnabled()) {
   			logger.debug("Bean factory for " + getDisplayName() + ": " + beanFactory);
   		}
   		return beanFactory;
   }
   
   protected final void refreshBeanFactory() throws BeansException {
   		if (hasBeanFactory()) {
   			destroyBeans();
   			closeBeanFactory();
   		}
   		try {
   			DefaultListableBeanFactory beanFactory = createBeanFactory();
   			beanFactory.setSerializationId(getId());
   			customizeBeanFactory(beanFactory);
   			loadBeanDefinitions(beanFactory);
   			synchronized (this.beanFactoryMonitor) {
   				this.beanFactory = beanFactory;
   			}
   		}
   		catch (IOException ex) {
   			throw new ApplicationContextException("I/O error parsing bean definition source for " + getDisplayName(), ex);
   		}
   	}
   
   @Override
   	public final ConfigurableListableBeanFactory getBeanFactory() {
   		synchronized (this.beanFactoryMonitor) {
   			if (this.beanFactory == null) {
   				throw new IllegalStateException("BeanFactory not initialized or already closed - " +
   						"call 'refresh' before accessing beans via the ApplicationContext");
   			}
   			return this.beanFactory;
   		}
   	}
   ```

   

3. prepareBeanFactory该方法在beanFactory中排除了一些特殊的依赖接口，以及在容器中注入了BeanFactory、ApplicationContext等容器的对象，这也是为什么我们可以在应用中依赖BeanFactory、ApplicationContext的原因。

   ```java
   protected void prepareBeanFactory(ConfigurableListableBeanFactory beanFactory) {
   		// Tell the internal bean factory to use the context's class loader etc.
   		beanFactory.setBeanClassLoader(getClassLoader());
   		beanFactory.setBeanExpressionResolver(new StandardBeanExpressionResolver(beanFactory.getBeanClassLoader()));
   		beanFactory.addPropertyEditorRegistrar(new ResourceEditorRegistrar(this, getEnvironment()));
   
   		// Configure the bean factory with context callbacks.
   		beanFactory.addBeanPostProcessor(new ApplicationContextAwareProcessor(this));
   		beanFactory.ignoreDependencyInterface(EnvironmentAware.class);
   		beanFactory.ignoreDependencyInterface(EmbeddedValueResolverAware.class);
   		beanFactory.ignoreDependencyInterface(ResourceLoaderAware.class);
   		beanFactory.ignoreDependencyInterface(ApplicationEventPublisherAware.class);
   		beanFactory.ignoreDependencyInterface(MessageSourceAware.class);
   		beanFactory.ignoreDependencyInterface(ApplicationContextAware.class);
   
   		// BeanFactory interface not registered as resolvable type in a plain factory.
   		// MessageSource registered (and found for autowiring) as a bean.
   		beanFactory.registerResolvableDependency(BeanFactory.class, beanFactory);
   		beanFactory.registerResolvableDependency(ResourceLoader.class, this);
   		beanFactory.registerResolvableDependency(ApplicationEventPublisher.class, this);
   		beanFactory.registerResolvableDependency(ApplicationContext.class, this);
   
   		// Register early post-processor for detecting inner beans as ApplicationListeners.
   		beanFactory.addBeanPostProcessor(new ApplicationListenerDetector(this));
   
   		// Detect a LoadTimeWeaver and prepare for weaving, if found.
   		if (beanFactory.containsBean(LOAD_TIME_WEAVER_BEAN_NAME)) {
   			beanFactory.addBeanPostProcessor(new LoadTimeWeaverAwareProcessor(beanFactory));
   			// Set a temporary ClassLoader for type matching.
   			beanFactory.setTempClassLoader(new ContextTypeMatchClassLoader(beanFactory.getBeanClassLoader()));
   		}
   
   		// Register default environment beans.
   		if (!beanFactory.containsLocalBean(ENVIRONMENT_BEAN_NAME)) {
   			beanFactory.registerSingleton(ENVIRONMENT_BEAN_NAME, getEnvironment());
   		}
   		if (!beanFactory.containsLocalBean(SYSTEM_PROPERTIES_BEAN_NAME)) {
   			beanFactory.registerSingleton(SYSTEM_PROPERTIES_BEAN_NAME, getEnvironment().getSystemProperties());
   		}
   		if (!beanFactory.containsLocalBean(SYSTEM_ENVIRONMENT_BEAN_NAME)) {
   			beanFactory.registerSingleton(SYSTEM_ENVIRONMENT_BEAN_NAME, getEnvironment().getSystemEnvironment());
   		}
   	}
   ```

4. postProcessBeanFactory 空方法预留给子类的扩展点

5. invokeBeanFactoryPostProcessors获取容器中所有的BeanFactoryPostProcessor对象，并对掉用该对象的方法。BeanFactoryPostProcessor是Spring容器预留出来的接口为了就是给用户能够在BeanFactory工作之前操作BeanFactory对象，实现用户自定义的逻辑，一般用于编写一个基于Spring的框架时会用到

6. registerBeanPostProcessors初始化容器中所有的BeanPostProcessor类的定义，并对这些BeanPostProcessor对象进行排序分类，重新注入到容器属性中。BeanPostProcessor是Spring容器预留出来的一个接口，用于在Spring初始化bean时对bean进行操作，(AOP也是通过这个实现的，在bean初始化后对bean进行增强)

7. initMessageSource初始化，该功能和国际化有关，感兴趣的话，后面可以深入讲解

8. initApplicationEventMulticaster初始化Spring容器的事件广播，如果没有配置applicationEventMulticaster的话就会初始化一个默认的。

9. onRefresh 空方法，预留给子类使用

10. registerListeners向Spring容器中的事件广播中注入监听事件ApplicationListener

11. finishBeanFactoryInitialization这里面最主要做的事情就是初始化所有scope为singleton的bean，默认情况下scope都为singleton

12. finishRefresh初始化LifecycleProcessor类型的bean定义，并调用onRefresh()方法，最后在事件广播中向所有的监听广播容器刷新完成事件。

13. resetCommonCaches清除Spring工具的一些缓存

    ```java
    protected void resetCommonCaches() {
        ReflectionUtils.clearCache();
        ResolvableType.clearCache();
        CachedIntrospectionResults.clearClassLoader(getClassLoader());
    }
    ```

### 四、总结

​	写的不好，还贴了很多代码，请大家见谅