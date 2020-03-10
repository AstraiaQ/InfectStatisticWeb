package edu.fzu.web.pojo;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
 

public class DataParser {
	public static void main (String[] args) {
		String httpUrl = "http://api.tianapi.com/txapi/ncovcity/index?"
				+ "key=cfcba533afa3028456b85318c3b8ac6e"
				+ "&date=2020-03-10";
		String url2 = "http://api.tianapi.com/txapi/ncovcity/index"
				+ "?key=5d4fb67d8bd16c1fd371311e334a4bd0";
		String jsonResult = request(httpUrl,"");
		System.out.println(jsonResult);
		
		
		
	}
	
	/**
	 * @param urlAll
	 *            :请求接口
	 * @param httpArg
	 *            :参数
	 * @return 返回结果
	 */
	public static String request(String httpUrl, String httpArg) {
	    BufferedReader reader = null;
	    String result = null;
	    StringBuffer sbf = new StringBuffer();
	    if (!httpArg.equals("")) {
	    	httpUrl = httpUrl + "?" + httpArg;
	    }
	    	
	    try {
	        URL url = new URL(httpUrl);
	        HttpURLConnection connection = (HttpURLConnection) url
	                .openConnection();
	        connection.setRequestMethod("GET");
	        InputStream is = connection.getInputStream();
	        reader = new BufferedReader(new InputStreamReader(is, "UTF-8"));
	        String strRead = null;
	        while ((strRead = reader.readLine()) != null) {
	            sbf.append(strRead);
	            sbf.append("\r\n");
	        }
	        reader.close();
	        result = sbf.toString();
	     
	    } catch (Exception e) {
	        e.printStackTrace();
	    }
	    return result;
	}
}
