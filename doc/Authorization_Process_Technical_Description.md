## [#](#授权流程技术说明) 授权流程技术说明

## [#](#一、概述) 一、概述

### [#](#（1）整体说明) （1）整体说明

1、本文涉及的小程序或者公众号授权给第三方平台的技术实现流程仅适用于平台型第三方平台，不适用于定制化型第三方平台。

2、当前提供了三种授权方式，分别是PC版扫码授权、H5版授权及小程序插件版授权，开发者可根据自身业务情况，选择合适的授权方式。

3、服务商获取商家授权是“服务商为商家提供服务”的基础，服务商可以按照下方文档说明构建授权链接与授权码，亦可以通过“一键部署官方提供的第三方平台云服务”的方式获得系统自动生成的授权链接与授权码。

4、完成一次完整的授权，需要服务商与商家的配合，相关流程如下。

![](https://res.wx.qq.com/op_res/9e3p9auJGt8pGy36H3v7QEv4xP_bqgBpdFx7gWzl6AXZ6cEbr_UdUxqxalNLvAAhVNQeOwIL6VoTpbqKzWpjmA)

### [#](#（2）自建授权链接) （2）自建授权链接

步骤一、前往微信开放平台-第三方平台-详情-开发配置，完成权限集与开发资料的配置。

步骤二、调用接口获取预授权码（pre\_auth\_code），接口详情请查看[api\_create\_preauthcode](https://developers.weixin.qq.com/doc/oplatform/Third-party_Platforms/2.0/api/ThirdParty/token/pre_auth_code.html)

步骤三、准备“授权回调 URI”，然后按照官方文档规则生成PC端的授权二维码或者移动端的授权链接，详情请看下方说明

步骤四、公众号/小程序管理员扫码或者访问移动端授权链接，确认同意授权给第三方平台。（如果该第三方平台账号尚未全网发布，则需要先将要用于测试的公众号或者小程序加入第三方平台-开发资料的“授权测试公众号/小程序列表”。）

步骤五、管理员授权确认之后，授权页会自动跳转进入回调 URI，并在 URL 参数中返回授权码和过期时间(redirect\_url?auth\_code=xxx&expires\_in=600)。

步骤六、调用接口生成[authorizer\_access\_token](https://developers.weixin.qq.com/doc/oplatform/openApi/OpenApiDoc/ticket-token/getAuthorizerAccessToken.html)，然后以该token调用公众号或小程序的相关 API。

### [#](#（3）使用官方云服务生成授权链接) （3）使用官方云服务生成授权链接

步骤一、创建第三方平台账号时选择云服务，然后一键部署、一键配置，完成搭建。

步骤二、前往“服务商微管家”-管家中心-授权链接生成器，即可复制已经生成的授权链接和授权码。其余步骤，同上。

![](https://res.wx.qq.com/op_res/17RqZsXWWNzr5D7SjlJ6cvIcPgOBqCuc00RGDBLBddKZxSIw6UMSMrLVB_m8abO6BDIXJoiwWKdKjkeTu0r6yw)

### [#](#（4）补充说明) （4）补充说明

+   服务商能代商家调用哪些 API，取决于商家将哪些权限集授权给了服务商，也取决于公众号或小程序自身拥有哪些接口权限，使用 JS SDK 等能力。
    
+   如果商家需要解除授权，则需要登录[微信公众平台](https://mp.weixin.qq.com/)进行操作；当前不支持第三方服务商主动解除授权。
    
+   如果小程序/公众号管理员只想取消对服务商的个别权限集的授权，则可以重新扫码进入授权页面，然后自定义权限集，重新授权即可。（如果是小程序商家，则可以前往[微信公众平台](https://mp.weixin.qq.com/) - 设置-第三方设置-管理授权，进入更新授权页面后取消部分授权即可）
    
+   当官方开放新的权限集，服务商可前往第三方平台增加新的权限，以满足新的业务需求。修改后新授权的公众号/小程序授权时会增加新权限的申请；已授权的老用户，旧有权限不影响，但新权限集需要商家重新扫描授权升级后才可获得。
    
+   权限集只可以授权给公众号或者普通小程序和小商店，其他类型的账号暂时不支持。可通过[api\_get\_authorizer\_info](https://developers.weixin.qq.com/doc/oplatform/Third-party_Platforms/2.0/api/ThirdParty/token/api_get_authorizer_info.html)查看账号的类型。
    

### [#](#（5）视频号授权说明) （5）视频号授权说明

+   服务商构建授权链接或者授权码后可发送给商家进行扫码或选择授权账号，将指定的授权账号授权与服务商；如果选择的授权账号为视频号，则商家需前往[视频号控制台](https://channels.weixin.qq.com/login.html) - 直播管理 - 开放能力，开通开放能力后方可授权
+   开通相关能力后的交互可参考如下（并且可在该控制台上解除与服务商的授权）：

![](https://testchu-7gy8occc8dcc14c3-1304825656.tcloudbaseapp.com/img%2Fmelody%2F202309261050407.png)

## [#](#二、授权链接构建的方法) 二、授权链接构建的方法

### [#](#_1、授权链接参数说明) 1、授权链接参数说明

| 参数 | 必填 | 说明 |
| --- | --- | --- |
| component\_appid | 是 | 第三方平台方 appid |
| pre\_auth\_code | 是 | 预授权码 |
| redirect\_uri | 是 | \- 授权回调 URI(填写格式为https://xxx)。（插件版无该参数）  
\- 管理员授权确认之后会自动跳转进入回调 URI，并在 URL 参数中返回授权码和过期时间(redirect\_url?auth\_code=xxx&expires\_in=600) |
| auth\_type | 是 | \- 要授权的账号类型，即商家点击授权链接或者扫了授权码之后，展示在用户手机端的授权账号类型。  
\- 1 表示手机端仅展示公众号；2 表示仅展示小程序，3 表示公众号和小程序都展示。  
\- 4表示小程序推客账号；  
\- 5表示视频号账号；  
\- 6表示全部，即公众号、小程序、视频号都展示  
\- 8表示带货助手账号；  
\- 第三方平台开发者可以使用本字段来控制授权的账号类型。  
\- 对于已经注销、冻结、封禁、以及未完成注册的账号不再出现于授权账号列表。 |
| biz\_appid | 否 | \- 指定授权唯一的小程序或公众号 。  
\- 如果指定了appid，则只能是该appid的管理员进行授权，其他用户扫码会出现报错。  
\- auth\_type、biz\_appid 两个字段如果设置的信息冲突，则biz\_appid生效的优先级更高。  
\- 例如，auth\_type=1，但是biz\_appid是小程序的appid，则会按照auth\_type=2来处理，即以biz\_appid的类型为准去拉出来对应的权限集列表. |
| category\_id\_list | 否 | \- 指定的权限集id列表，如果不指定，则默认拉取当前第三方账号已经全网发布的权限集列表。  
\- 如需要指定单个权限集ID，写法为“category\_id\_list=99” ，如果有多个权限集，则权限集id与id之间用中竖线隔开。 |

### [#](#_2、授权列表页逻辑说明) 2、授权列表页逻辑说明

+   当商家进入了授权账号列表页展示的账号列表，除了受“授权参数”影响，还与第三方平台账号的配置有关，以及与微信号用户的角色有关。

![](https://res.wx.qq.com/op_res/YBBZyYLgkT2BWus8yJUvrpGrZBbDfIOPA0GzhnQvAhCNrAVdQ7lPuTtBBtyH-zxbRRW7Oa3oBJsNxQeLURXzvQ)

### [#](#_3、不同类型授权链接使用场景) 3、不同类型授权链接使用场景

| 版本 | 使用场景 |
| --- | --- |
| PC版 | \- 访问PC版授权链接则会自动出现授权码，商家以微信扫码的方式进入授权账号列表页，选择账号以完成授权。  
\- 通常将该链接放置服务商PC版官网或者saas业务控制台中 |
| H5版 | \- 访问H5版授权链接则直接进入授权账号列表页，选择账号以完成授权。  
\- 通常将该链接放置服务商H5版（例如服务号）官网或者saas业务控制台中 |
| 插件版 | \- 商家可在服务商小程序里直接进入授权账号列表页，选择账号以完成授权。  
\- 通常将该链接放置服务商小程序版官网或者saas业务控制台中 |

### [#](#_4、授权链接拼接方式) 4、授权链接拼接方式

| 版本 | 使用场景 |
| --- | --- |
| PC版 | https://mp.weixin.qq.com/cgi-bin/componentloginpage?component\_appid=xxxx&pre\_auth\_code=xxxxx&redirect\_uri=xxxx&auth\_type=xxx |
| H5版-新版 | https://open.weixin.qq.com/wxaopen/safe/bindcomponent?action=bindcomponent&no\_scan=1&component\_appid=xxxx&pre\_auth\_code=xxxxx&redirect\_uri=xxxx&auth\_type=xxx&biz\_appid=xxxx#wechat\_redirect |

### [#](#_5、插件版使用方式) 5、插件版使用方式

+   需先申请“服务商组件”方可使用插件版授权页，关于小程序服务商组件到更多使用指南，请查看[https://developers.weixin.qq.com/doc/oplatform/Third-party\_Platforms/2.0/product/Register\_Mini\_Programs/beta\_mp\_plugin.html](https://developers.weixin.qq.com/doc/oplatform/Third-party_Platforms/2.0/product/Register_Mini_Programs/beta_mp_plugin.html)。

#### [#](#代码示例) 代码示例

```json
const MiniprogramThirdpartyPlugin = requirePlugin('miniprogram-thirdparty-plugin')  

// 初始化 
MiniprogramThirdpartyPlugin.init(wx)  

// 请求用户授权 
MiniprogramThirdpartyPlugin.openAuthorizeAccount({
   platformAppID: '', 
   preAuthCode：‘’，//获取的预授权码
   authType：3， 
   bizAppid: wxxxxxxxxx,//非必填字段，参数详情请看文章末尾
   }) 
```

#### [#](#插件版参数说明) 插件版参数说明

| 参数 | 必填 |  |
| --- | --- | --- |
| platformAppID | 是 | 第三方平台方 appid |
| preAuthCode | 是 | 预授权码，可通过[pre\_auth\_code接口](https://developers.weixin.qq.com/doc/oplatform/Third-party_Platforms/2.0/api/ThirdParty/token/pre_auth_code.html)获得 |
| authType | 是 | 要授权的账号类型：1 则商户点击链接后，手机端仅展示公众号、2 表示仅展示小程序，3 表示公众号和小程序都展示。如果为未指定，则默认小程序和公众号都展示。第三方平台开发者可以使用本字段来控制授权的账号类型。 |
| bizAppid | 否 | 指定授权唯一的小程序或公众号 |

## [#](#三、商家的使用步骤) 三、商家的使用步骤

+   可前往[授权相关操作](https://developers.weixin.qq.com/doc/oplatform/Third-party_Platforms/2.0/operation/authorization/authorization_management.html)进行查看。