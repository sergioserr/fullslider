package com.fullslider.testMarkdown;

import java.util.logging.Level;
import java.util.logging.Logger;
import junit.framework.Assert;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.interactions.Actions;

public class AppTest{
    WebDriver driver;
    JavascriptExecutor js;
    Actions actions;
    	
    @Before
    public void setUp() {
        System.setProperty("webdriver.chrome.driver", "C://Users/sergi/Downloads/chromedriver.exe");
        driver = new ChromeDriver();
        createPresentation("New Presentation");
    }

    @After
    public void tearDown() {
        driver.close();
    }
    
    public void waitForAction() {
        try {
            Thread.sleep(1000);
        } catch (InterruptedException ex) {
            Logger.getLogger(AppTest.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    
    public void createPresentation(String title) {
        js = (JavascriptExecutor) driver;
        actions = new Actions(driver);

        driver.get("http://localhost:8888");
        driver.manage().window().maximize();

        js.executeScript("$('.newpresopanel')[0].click()");
        js.executeScript("$('#titleinput').val('" + title + "')");
        js.executeScript("$('.createpresentation')[0].click()");
    }

    @Test
    public void addTextAndMoveIt() {
        js.executeScript("$('#addtextbtn').click()");
        WebElement draggable = driver.findElement(By.xpath("//div[@id='workspace']/div[2]/div/section/div[2]"));
    
        waitForAction();
    
        new Actions(driver)
                .dragAndDropBy(draggable, 10, 200)
                .build()
                .perform();
        draggable.click();
        
        waitForAction();
        
        WebElement textEditor = driver.findElement(By.xpath("//*[@id=\"markdown-text\"]"));
        String textResult = textEditor.getAttribute("value");
        Assert.assertEquals("#\n" +
                            "\n" +
                            "{options: left: '4.39239',top: '26.0615',}\n" +
                            "---\n" +
                            "Sample Text\n" +
                            "\n", textResult);
    }
    
    @Test
    public void addCodeAndEditIt(){
        js.executeScript("$('#addcodebtn').click()");
        WebElement codeElement = driver.findElement(By.xpath("//div[@id='workspace']/div[2]/div/section/div[2]"));
        
        waitForAction();
        
        actions.doubleClick(codeElement).build().perform();
        
        waitForAction();        
        
        driver.findElement(By.xpath("//*[@id=\"code-style-menu\"]/a")).click();
        driver.findElement(By.xpath("//*[@id=\"code-style-menu\"]/ul/li/a[1]")).click();
        
        waitForAction();        
        
        WebElement textEditor = driver.findElement(By.xpath("//*[@id=\"markdown-text\"]"));
        String textResult = textEditor.getAttribute("value");
        Assert.assertEquals("#\n" +
                            "\n" +
                            "{options: style: 'agate',}\n" +
                            "---\n" +
                            "`function example(){\n" +
                            "alert();\n" +
                            "}`\n" +
                            "\n", textResult);
    }
    
    @Test
    public void addTextForEditor(){
        WebElement textEditor = driver.findElement(By.xpath("//*[@id=\"markdown-text\"]"));
        textEditor.sendKeys("Text of test");
        
        waitForAction();
        
        driver.findElement(By.id("workspace")).click();
    
        waitForAction();
        
        WebElement codeElement = driver.findElement(By.xpath("//div[@id='workspace']/div[2]/div/section/div[2]/div/font"));
        String textResult = codeElement.getAttribute("textContent");
        Assert.assertEquals("Text of test", textResult);
    }
    
    @Test
    public void addFigureAndDeleteIt(){
        WebElement textEditor = driver.findElement(By.xpath("//*[@id=\"markdown-text\"]"));
        textEditor.sendKeys(">");
    
        waitForAction();
    
        driver.findElement(By.id("workspace")).click();
    
        waitForAction();
        
        String textResult = textEditor.getAttribute("value");
        Assert.assertEquals("#\n" +
                            "\n" +
                            ">\n" +
                            "\n", textResult);
        
        waitForAction();
        
        driver.findElement(By.xpath("//div[@id='workspace']/div[2]/div/section/div[2]")).click();
        driver.findElement(By.xpath("//*[@id=\"spandelete\"]")).click();
        
        waitForAction();
        
        textResult = textEditor.getAttribute("value");
        Assert.assertEquals("#\n" +
                            "\n", textResult);
    }
    
    @Test
    public void addElementsAndDeleteSlide(){
        WebElement textEditor = driver.findElement(By.xpath("//*[@id=\"markdown-text\"]"));
        textEditor.sendKeys("1" + "\n\n" + ">" + "\n\n");
        
        waitForAction();
        
        driver.findElement(By.id("workspace")).click();
        
        waitForAction();
        
        driver.findElement(By.xpath("//*[@id=\"addtextbtn\"]")).click();
        driver.findElement(By.xpath("//*[@id=\"addcodebtn\"]")).click();
        driver.findElement(By.xpath("//*[@id=\"addslidebtn\"]")).click();
        
        waitForAction();
        
        String textResult = textEditor.getAttribute("value");
        Assert.assertEquals("#\n" +
                            "\n" +
                            "`function example(){\n" +
                            "alert();\n" +
                            "}`\n" +
                            "\n" +
                            "Sample Text\n" +
                            "\n" +
                            "1\n" +
                            "\n" +
                            ">\n" +
                            "\n" +
                            "#\n" +
                            "\n", textResult);
        
        waitForAction();
        
        WebElement slide = driver.findElement(By.xpath("//*[@id=\"vertical-toolbar\"]/div/div/div/div"));
        slide.click();
        
        waitForAction();
        
        driver.findElement(By.xpath("//*[@id=\"vertical-toolbar\"]/div/div/div/div/a")).click();
        
        waitForAction();
        
        textResult = textEditor.getAttribute("value");
        Assert.assertEquals("#\n" +
                            "\n", textResult);
    }
}
