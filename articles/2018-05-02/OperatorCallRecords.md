### 如何爬取运营商通话记录

　　在一些风险领域中，企业需要用户授权来获取用户的通话记录，通过分析用户的通话记录可以判断用户的风险状况。例如互联网小贷公司，公司获取了通话记录信息后，就可以分析用户是否和一些不良客户存在通话联系，以此来判断用户的可贷款额度。

　　今天我要介绍的就是使用Selenium+PhantomJSDriver来爬取运营商的通话记录。



##### 一、HttpClient从使用到放弃

　　在刚刚开始时，我的大脑闪现的第一想法就是使用HttpClient来爬取运营商的数据，并且也成功获取到了联通电话号码（本人的电话就是联通的）的用户记录。对HttpClient感兴趣的观众可以看看一下实现代码。但是当我在获取移动电话的电话号码时，就遇到了如下问题：

1. 移动网上运营商网站有多个，基本是每个省份都有一个自己的运营商网站
2. 有一个http://www.10086.cn网站可以查寻通话记录，但是在查询之前需要和电话号码所在省份的运营商网站做授信登录（授信登录接口非常复杂）。
3. 如果去每个省份自己的运营商那就需要些多份爬取逻辑。

　　最终我放弃直接使用HttpClient去爬取数据，改为使用Selenium+PhantomJSDriver来获取通话记录信息。

```java
public class Demo {

    //只是对httpclient的简单封装
    private static HttpBuilder builder;

    public static void checkVerify() throws IOException {
        String url = "http://uac.10010.com/portal/Service/CheckNeedVerify?callback=check&userName=175*****438&pwdType=01&_=1524542319955";
        builder.post(url, (HttpEntity) null);
    }

    public static void sendSms() throws IOException {
        Date now = new Date();
        String url = "http://uac.10010.com/portal/Service/SendCkMSG?callback=sms&_=" + now.getTime();
        Map<String, String> params = new HashMap<>();
        params.put("mobile", "175*****438");
        params.put("req_time", String.format("%d", now.getTime()));
        builder.post(url, params);
    }


    public static void login(String code) throws IOException {
        Date now = new Date();
        String url = "http://uac.10010.com/portal/Service/MallLogin?callback=login";
        Map<String, String> params = new HashMap<>();
        params.put("redirectURL", "http://www.10010.com");
        params.put("userName", "175*****438");
        params.put("password", "*****");
        params.put("pwdType", "01");
        params.put("productType", "01");
        params.put("redirectType", "01");
        params.put("rememberMe", "1");
        params.put("verifyCKCode", code);
        params.put("req_time", String.format("%d", now.getTime()));
        builder.post(url, params);
    }

    public static void main(String[] args) throws Exception {
        Scanner sc = new Scanner(System.in);
        builder = HttpBuilder.getInstance();

        Map<String, String> heads = new HashMap<>();
        heads.put("Host", "uac.10010.com");
        heads.put("Pragma", "no-cache");
        heads.put("Referer", "http://uac.10010.com/portal/hallLogin");
        heads.put("User-Agent", "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.19 Safari/537.36");
        builder.addHeader(heads);


        checkVerify();
        sendSms();


        System.out.print("请输入登录短信验证码：");

        String code = sc.next();
        System.out.println("verify code:" + code);
        login(code);

        builder.printCookies();


        heads = new HashMap<>();
        heads.put("Host", "iservice.10010.com");
        heads.put("Pragma", "no-cache");
        heads.put("Referer", "http://iservice.10010.com/e4/query/bill/call_dan-iframe.html?menuCode=000100030001");
        heads.put("User-Agent", "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.19 Safari/537.36");

        builder.addHeader(heads);

        int pageSize = 100;
        int pageNo = 1;
        int totalPages = 1;
        while (pageNo <= totalPages) {
            checkLogin();
            checkMapExtraParam();
            String json = queryDetail(pageNo, pageSize, "20180401", "20180424");
            JSONObject detail = JSON.parseObject(json);

            boolean succ = detail.getBoolean("isSuccess");
            if (!succ) {
                throw new RuntimeException("查询通话记录失败");
            }

            JSONObject pageObj = detail.getJSONObject("pageMap");
            pageNo = pageObj.getIntValue("pageNo");
            totalPages = pageObj.getIntValue("totalPages");
            pageSize = pageObj.getIntValue("pageSize");
            pageNo++;

            JSONArray arr = pageObj.getJSONArray("result");
            if (null == arr || arr.size() == 0) {
                continue;
            }

            for (int i = 0; i < arr.size(); i++) {
                System.out.println("=========================");
                System.out.println(arr.get(i).toString());
                System.out.println("=========================");
            }
        }
    }


    public static void checkLogin() throws IOException {
        String url = "http://iservice.10010.com/e3/static/check/checklogin";
        builder.post(url, (HttpEntity) null);
    }

    public static void checkMapExtraParam() throws IOException {
        String url = "http://iservice.10010.com/e3/static/query/checkmapExtraParam";
        Map<String, String> params = new HashMap<>();
        params.put("menuid", "000100030001");
        builder.post(url, params);
    }

    public static String queryDetail(int pageNo, int pageSize, String beginDate, String endDate) throws IOException {
        String url = "http://iservice.10010.com/e3/static/query/callDetail";
        Map<String, String> params = new HashMap<>();
        params.put("accessURL", "http://iservice.10010.com/e4/query/bill/call_dan-iframe.html?menuCode=000100030001&menuid=000100030001");
        params.put("pageNo", String.valueOf(pageNo));
        params.put("pageSize", String.valueOf(pageSize));
        params.put("beginDate", beginDate);
        params.put("endDate", endDate);

        return builder.post(url, params);
    }
```

##### 二、Selenium+PhantomJSDriver简介

　　对于不熟悉的人可能会好奇这两个工具到底是啥？下面我会对其做一个简单介绍。

　　Selenium是一个web应用程序的测试工具。通过浏览器厂商提供的驱动来操作浏览器，例如：访问某个网站，点击网站上面的按钮，执行js脚本等。

　　PhantomJSDriver是一个内存中的无界浏览器,当我们使用PhantomJSDriver操作网站时，我们感觉不到浏览器在运行，如果使用Chrome驱动，我们需要安装chrome同时代码在运行时需要打开浏览器，显然使用Chrome驱动的代码不适合在linux服务器上使用。这就是我选择它的理由，大家可以根据自己的需要选择。

##### 三、使用Selenium+PhantomJSDriver爬取移动数据

1. 登录移动网站

   1. 使用Selenium加载PhantomJSDriver渠道
   2. 打开移动的登录网址https://login.10086.cn/login.html
   3. 输入手机号、服务密码
   4. 等待发送短信验证码按钮显示，并点击
   5. 输入短信验证码并点击登录按钮

   ```java
   //加载渠道
   system.setProperty("webdriver.chrome.driver","D:\\chromedriver.exe");
   WebDriver driver = new ChromeDriver();
   //打开网址
   driver.get("https://login.10086.cn/login.html");
   //输入手机号码
   WebElement element = driver.findElement(By.id("p_name"));
   System.out.print("请输入手机号码:");
   mobile = sc.next();
   element.sendKeys(mobile);
   //输入服务密码
   element = driver.findElement(By.id("p_pwd"));
   System.out.print("请输入服务密码:");
   password = sc.next();
   element.sendKeys(password);
   //等待器
   WebDriverWait wait = new WebDriverWait(driver,60);
   //等待发送短信按钮显示并点击
   wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("getSMSPwd")));
   element = driver.findElement(By.id("getSMSPwd"));
   element.click();
   //输入短信验证码
   System.out.print("请输入登录短信验证码:");
   String smscode = sc.next();
   element = driver.findElement(By.id("sms_pwd"));
   element.sendKeys(smscode);
   //点击登录按钮
   element = driver.findElement(By.id("submit_bt"));
   element.click();
   //浏览器在跳转到登录成功界面
   Thread.sleep(5000);
   System.out.println("Hello,"+mobile+"，登录移动网页成功！！");
   ```

2. 点击主页上面的菜单按钮，进入通话详情页面

   ```java
   wait.until(ExpectedConditions.visibilityOfElementLocated(By.linkText("详单查询")));
   wait.until(ExpectedConditions.elementToBeClickable(By.linkText("详单查询")));
   element = driver.findElement(By.linkText("详单查询"));
   element.click();
   screen(driver,"home_002");
   System.out.println("成功进入详单查询界面");
   
   Thread.sleep(5000);
   //点击通话详单
   wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//li[@eventcode='UCenter_billdetailqry_type_THXD']")));
   element = driver.findElement(By.xpath("//li[@eventcode='UCenter_billdetailqry_type_THXD']"));
   element = element.findElement(By.tagName("a"));
   element.click();
   screen(driver,"home_003");
   System.out.println("成功进入通话详情界面");
   ```

3. 通话详情界面做授信登录

   1. 输入手机号码
   2. 输入图形验证码
   3. 输入短信验证码
   4. 点击登录按钮

   ```java
   wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("show_vec_firstdiv")));
   screen(driver,"home_004");
   element = driver.findElement(By.id("vec_servpasswd"));
   element.sendKeys(password);
   
   Thread.sleep(10000);
   
   System.out.print("请输入图片验证码：");
   smscode = sc.next();
   driver.findElement(By.id("vec_imgcode")).sendKeys(smscode);
   System.out.println("填写验证码成功");
   
   do{
       wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("stc-send-sms")));
       driver.findElement(By.id("stc-send-sms")).click();
       wait.until(ExpectedConditions.alertIsPresent());
       driver.switchTo().alert().accept();
       System.out.print("是否重新发送短信验证码:");
       smscode = sc.next();
   }while ("Y".equalsIgnoreCase(smscode));
   
   System.out.print("请输入短信验证码:");
   smscode = sc.next();
   driver.findElement(By.id("vec_smspasswd")).sendKeys(smscode);
   
   
   wait.until(ExpectedConditions.elementToBeClickable(By.id("tmpl-data")));
   driver.findElement(By.id("vecbtn")).click();
   ```

4. 获取通话记录表格中的通话记录信息

   ```java
   List<WebElement> trs =  driver.findElement(By.id("tbody")).findElements(By.tagName("tr"));
   for(WebElement tr:trs){
       System.out.println(tr.getText());
   }
   ```

   