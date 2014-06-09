---
layout: post
title:  "Flash messages in nancyfx"
subtitle:	"An implementation of the popular flash messages pattern for nancyfx"
date:   2014-05-23 00:14:48
header_background_color:	"#000"
categories: articles
tags: nancyfx c#
header_image: "/img/flash.jpg"
header_image_width: 1920
header_image_height: 800
---

Flash messages. Every web framework seems to `ave em. They may go by different names in different libs, but they all do about the same thing; you set a message you intend for your user to see from the server while handling their request. They are rendered to some prominent position in your UI, they only ever render once, and they persist between redirects. Nancy.FlashMessages is an implementation of your garden-variety flash message functionality for the nancyfx web framework.

## Installation

Via nuget. Install the Nancy.FlashMessages.Razor package. This will pull down the Nancy.FlashMessages core package as a dependency.

{% highlight powershell %}
Install-Package Nancy.FlashMessages.Razor
{% endhighlight %}

## Enabling Nancy.FlashMessages

Enable Nancy.FlashMessages in the ApplicationStartup method of your bootstrapper

{% highlight c# %}
protected override void ApplicationStartup(Nancy.TinyIoc.TinyIoCContainer container, Nancy.Bootstrapper.IPipelines pipelines)
{
	base.ApplicationStartup(container, pipelines);
        
	FlashMessages.Enable(pipelines);
}
{% endhighlight %}

You can also provide a custom configuration, by sending your own implementation of FlashMessagesConfiguration.

{% highlight c# %}
protected override void ApplicationStartup(Nancy.TinyIoc.TinyIoCContainer container, Nancy.Bootstrapper.IPipelines pipelines)
{
	base.ApplicationStartup(container, pipelines);
        
	FlashMessages.Enable(pipelines, CustomFlashMessagesConfiguration());
}
{% endhighlight %}

See below for an example of how to use a custom configuration class to alter the message template used when rendering messages in the browser.

## Adding messages

Extension methods are added to both the NancyContext and NancyModule classes to make it easy to set messages. From within a NancyModule:

{% highlight c# %}
public class MyModule : NancyModule {
	public MyModule() {
		Get["/"] = _ => {
			this.FlashMessage(FlashMessages.Info, "Hello world");
		};
	}
}
{% endhighlight %}

Or, from anywhere that you have access to the current NancyContext:

{% highlight c# %}
context.FlashMessage(FlashMessages.Info, "Hello world");
{% endhighlight %}

The first argument to `FlashMessage()` is the message type. This is simply a string used to group messages. Normally this value will be used as a css class name in our message template. The standard message types are exposed as static values on the FlashMessages class, but you can use any values you like.

## Displaying messages

Currently, extension methods for the Razor engine HtmlHelpers class are provided, in order to render flash messages in your view.

{% highlight c# %}
@Html.FlashMessages("info")
@Html.FlashMessages("success")
{% endhighlight %}

The single argument is the message type to render. The most common practice is to place this code in a layout or partial view that is shared across your entire application. Messages are popped off the message buffer when they are rendered, so will only be rendered once per session.

## Customising the message template

The default message template that ships is designed to work with twitter bootstrap 3 css. If you'd like to change the template markup you can easily do this by providing a custom FlashMessagesConfiguration that uses your own implementation of the IFlashMessageRenderer interface. For example:

{% highlight c# %}
public class CustomFlashMessagesConfiguration : FlashMessagesConfiguration
{
    public CustomFlashMessagesConfiguration() : base()
    {
        GetRenderer = () => new CustomFlashMessageRenderer();
    }

    public class CustomFlashMessageRenderer : IFlashMessageRenderer
    {
        public string Render(string messageType, IEnumerable<string> messages)
        {
            var s = new StringBuilder();

            s.Append("<ul>");

            foreach (var message in messages)
            {
                s.Append(string.Format("<li>{0}: {1}</li>", messageType, message));
            }

            s.Append("</ul>");

            return s.ToString();
        }
    }
}
{% endhighlight %}