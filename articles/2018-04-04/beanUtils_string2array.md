## BeanUtils自定义stringToArray转换

BeanUtils工具在将String类型转为String[]，会对String字符串进行分割然后转换成数据，示例如下：

```java
public class Demo {
    public static void main(String[] args) throws Exception {
		Map<String, Object> map = new HashMap<>();
		map.put("email", "test@qq.com");
		Test test = new Test();
		BeanUtilsBean.getInstance().copyProperties(test, map);
        //{"email":["test","qq.com"]}
		System.out.println(JSON.toJSON(test));
	}
	public static class Test {
		private String[] email;
		public String[] getEmail() {
			return email;
		}
		public void setEmail(String[] email) {
			this.email = email;
		}
	}
}
```

此场景有时候并不能满足业务需求，我们需要的是将**test@qq.com**转换成**["test@qq.com"]**,此时我们需要自定义一个Convert用来满足业务需求，实现如下：

```java
public class StringArrayConverter extends ArrayConverter {
	@SuppressWarnings("rawtypes")
	public StringArrayConverter(Class defaultType, Converter elementConverter) {
		super(defaultType, elementConverter);
	}
	@SuppressWarnings("rawtypes")
	public StringArrayConverter(Class defaultType, Converter elementConverter, int defaultSize) {
		super(defaultType, elementConverter, defaultSize);
	}
	@SuppressWarnings({"unchecked", "rawtypes"})
	@Override
	protected Collection convertToCollection(Class type, Object value) {
		if (value instanceof Collection) {
			return (Collection) value;
		}
		if (value instanceof Number || value instanceof Boolean || value instanceof java.util.Date) {
			List list = new ArrayList(1);
			list.add(value);
			return list;
		}
		return parseElements(type, value.toString());
	}
	@SuppressWarnings({"rawtypes", "unchecked"})
	private List parseElements(Class type, String value) {
		value = value.trim();
		if (value.startsWith("{") && value.endsWith("}")) {
			value = value.substring(1, value.length() - 1);
		}
		try {
			List list = new ArrayList<>(1);
			list.add(value);
			return (list);
		} catch (Exception e) {
			throw new ConversionException("Error converting from String to '" + type + "': " + e.getMessage(), e);
		}
	}
}


public static void main(String[] args) throws Exception {
    	ConvertUtils.register(new StringArrayConverter(String[].class, new StringConverter(), 1), String[].class);
		Map<String, Object> map = new HashMap<>();
		map.put("email", "test@qq.com");
		Test test = new Test();
		BeanUtilsBean.getInstance().copyProperties(test, map);
    	//{"email":["test@qq.com"]}
		System.out.println(JSON.toJSON(test));
}

```

