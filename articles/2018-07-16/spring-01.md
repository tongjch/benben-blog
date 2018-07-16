## 初识Spring IOC

### 1. 背景简介

 	Java是一门面向对象的语言，在大多数Java软件中，Java程序的运行都需要多个对象的相互协作来完成。随着Java程序的越来越复杂，Java程序中的对象也越来越多，对象之间的依赖也越来越复杂，这时代码的维护将会变得越来越困难。IOC设计思想的出现，就是为了解决对象之间的复杂的依赖关系，减少对象之间的耦合。

​	在没有使用IOC容器之前，我们在使用一个对象之前，必须自己初始化一个对象，例如：

```java
/**
 * 用户服务类
 * 
 * @author tongjiachen
 *
 */
public class UserService {

  public Object queryByUserId(Long id) {
    return new Object();
  }
}

/**
 * 对外接口
 * 
 * @author tongjiachen
 *
 */
public class UserController {

  //手动初始化UserService
  private UserService service = new UserService();


  public Object queryById(Long id) {
    return this.service.queryByUserId(id);
  }
}


```

​	在上面的例子中我们通过手动的初始化用户服务（UserService）对象来掉用queryByUserId方法，此时这样这两个对象是直接耦合在一起的。在一个很简单的软件中，你也许感觉这并没有什么，但是随着我们开发的软件功能越来越多，软件的代码逻辑也越来越复杂，UserService提供的功能也越来越多，也许可能拥有各种各样的构造方法，也许是被各种各样的对象去依赖，也许UserService中也需要依赖各种各样的对象........,但是不管怎么说，这都不利于我们对代码的维护和管理。

### 2. 什么是IOC

​	IOC(Inversion of Control )中文翻译控制反转，个人理解为：不要直接去依赖一个对象，而是通过一种描述语言去描述你需要一个什么样的对象，然后告诉容器，容器听了你的描述后，就在容器中找到一个你需要的对象，然后将这个对象交给你。和上一个传统的例子相比，你获得的依赖对象的方式，从自身交给了容器，所以叫控制反转。

1. 容器

   ```
   这里可以简单的理解成装对象的一个箱子，如果非要理解成代码的话你可以理解成一个Map里面有各种各样的对象
   ```

2. 描述语言

   ```
   在Spring IOC容器中常用的描述语言有XML和注解，用于描述这个类的基本情况和依赖关系等
   ```

   

### 3. 什么是DI

​	DI(Dependency Injection)中文翻译依赖注入，相比IOC这种设计思想来说，DI可以看做是实现这种设计思想的一种手段，也可以傻瓜的理解成将你需要的对象，通过反射的方式注入到你的对象中。

​	