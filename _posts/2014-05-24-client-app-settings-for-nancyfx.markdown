---
layout: post
title:  "Client app settings for nancyfx"
subtitle:	"A neat little nuget package for pushing app settings down to javascript from the server side."
date:   2014-05-23 00:14:48
header_background_color:	"#d9534f"
categories: articles
tags: nancyfx c#
header_image_width: 1920
header_image_height: 800
---

Provides a simple API that makes sharing configuration data between your Nancy application on the server and your javascript in the browser simple.

## Features

- Easily expose specific appsettings from web.config to javascript
- Push dynamically generated configuration parameters down to the client from the server at runtime

## Installation

With Nuget

{% highlight powershell %}
Install-Package Nancy.ClientAppSettings
{% endhighlight %}

Normally you will want to install this package as a dependency for the `Nancy.ClientAppSettings.Razor` package, which adds HtmlHelper extensions to actually expose settings in your views.

{% highlight powershell %}
Install-Package Nancy.ClientAppSettings.Razor
{% endhighlight %}

## Bootstrapping

Enable `Nancy.ClientAppSettings` in your application bootstrappers `ApplicationStartup` method

{% highlight c# %}
protected override void ApplicationStartup(Nancy.TinyIoc.TinyIoCContainer container, Nancy.Bootstrapper.IPipelines pipelines)
{
	base.ApplicationStartup(container, pipelines);
        
	ClientAppSettings.Enable(pipelines);
}
{% endhighlight %}

The Enable method returns an instance of the `ClientAppSettings` object, which you can further configure in your bootstrapper. Read on...

## Accessing settings from outside of the bootstrapper

You can easily retrieve the `ClientAppSettings` object using the `GetClientAppSettings` extension method added to `NancyContext`

{% highlight c# %}
var settings = Context.GetClientAppSettings();
{% endhighlight %}

## Providing access to Web.config app settings to javascript

You can easily push appsettings from your web.config file down to javascript using the fluent api. For example, in your bootstrapper...

{% highlight c# %}
protected override void ApplicationStartup(Nancy.TinyIoc.TinyIoCContainer container, Nancy.Bootstrapper.IPipelines pipelines)
{
	base.ApplicationStartup(container, pipelines);
        
	ClientAppSettings.Enable(pipelines).WithAppSettings("MyAppSettingOne", "MyOtherAppSetting" ...);
}
{% endhighlight %}

Or from within a route handler in a Nancy Module

{% highlight c# %}
public MyModule : NancyModule {
	
	Get["/"] = _ => {

		Context.GetClientAppSettings().WithAppSettings("SomeSetting");

		//...
	};
}
{% endhighlight %}

## Setting and appending static and dynamic app settings

You can easily set a single app setting 

{% highlight c# %}
Context.GetClientAppSettings().Set("MySetting", "MyValue");
{% endhighlight %}

Or append multiple settings using the `Append(IDictionary<string, object> settings)` method

{% highlight c# %}
Context.GetClientAppSettings().Append(new Dictionary<string, object> {
	{ "SettingOne" , 1 },
	{ "SettingTwo", 2 }
});
{% endhighlight %}

You can also append dynamic values that can be calculated at runtime, using the `Append(Func<NancyContext, IDictionary<string, object>> appenderFunc)` overload. The appenderFunc will not be evaluated until the ClientAppSettings object is serialized, usually during view rendering

{% highlight c# %}
Context.GetClientAppSettings().Append(context => {
	return new Dictionary<string, object> {
		{ "CurrentUser", context.CurrentUser } 
	};
});
{% endhighlight %}

## Outputting settings in your views 

Obviously, setting javascript variables from the server is no use if we can't output them from within our views. Currently the Razor View engine is supported via the separate `Nancy.ClientAppSettings.Razor` nuget package.

This package will add some HtmlHelper extensions to make it easy to output your app settings to javascript.

The simplest method is via

{% highlight c# %}
@Html.RenderClientAppSettings()
{% endhighlight %}

This will render out the javasript app settings as well as enclosing script element:

{% highlight html %}
<script>
	var Settings = {
		"SettingOne" : "ValueOne",
		"SettingTwo" : "ValueTwo"
		//...
	};
</script>
{% endhighlight %}

By default app settings are output as a global variable named "Settings". You can easily change the name of the javascript variable using the `WithVariableName()` method in your bootstrapper

{% highlight c# %}
protected override void ApplicationStartup(Nancy.TinyIoc.TinyIoCContainer container, Nancy.Bootstrapper.IPipelines pipelines)
{
	base.ApplicationStartup(container, pipelines);
        
	ClientAppSettings.Enable(pipelines)
		.WithVariableName("AppSettings")
		.WithAppSettings("MyAppSettingOne", "MyOtherAppSetting" ...);
}
{% endhighlight %}