## [#](#获取令牌) 获取令牌

> 接口应在服务器端调用，详细说明参见[服务端API](https://developers.weixin.qq.com/miniprogram/dev/framework/server-ability/backend-api.html)。

## [#](#接口说明) 接口说明

### [#](#接口英文名) 接口英文名

getComponentAccessToken

### [#](#功能描述) 功能描述

令牌（component\_access\_token）是第三方平台接口的调用凭据

### [#](#注意事项) 注意事项

+   令牌的获取是有限制的，每个令牌的有效期为 2 小时，请自行做好令牌的管理，在令牌快过期时（比如1小时50分），重新调用接口获取。
+   生成component\_access\_token需要依赖component\_verify\_ticket。可点击查看[component\_verify\_ticket的详细介绍](https://developers.weixin.qq.com/doc/oplatform/Third-party_Platforms/2.0/api/ThirdParty/token/component_verify_ticket.html)

## [#](#调用方式) 调用方式

### [#](#HTTPS-调用) HTTPS 调用

```text

POST https://api.weixin.qq.com/cgi-bin/component/api_component_token 

```

### [#](#请求参数) 请求参数

| 属性 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| component\_appid | string | 是 | 第三方平台 appid |
| component\_appsecret | string | 是 | 第三方平台 appsecret |
| component\_verify\_ticket | string | 是 | 微信后台推送的 [ticket](https://developers.weixin.qq.com/doc/oplatform/Third-party_Platforms/2.0/api/ThirdParty/token/component_verify_ticket.html) |

### [#](#返回参数) 返回参数

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| component\_access\_token | string | 第三方平台 access\_token |
| expires\_in | number | 有效期，单位：秒 |

## [#](#调用示例) 调用示例

> 示例说明: HTTPS请求

### [#](#请求数据示例) 请求数据示例

```json

{
  "component_appid":  "appid_value" ,
  "component_appsecret":  "appsecret_value",
  "component_verify_ticket": "ticket_value"
} 

```

### [#](#返回数据示例) 返回数据示例

```json

{
  "component_access_token": "61W3mEpU66027wgNZ_MhGHNQDHnFATkDa9-2llqrMBjUwxRSNPbVsMmyD-yq8wZETSoE5NQgecigDrSHkPtIYA",
  "expires_in": 7200
} 

```

### [#](#错误码) 错误码

| 错误码 | 错误码取值 | 解决方案 |
| --- | --- | --- |
| \-1 | system error | 系统繁忙，此时请开发者稍候再试 |
| 40001 | invalid credential  access\_token isinvalid or not latest | 获取 access\_token 时 AppSecret 错误，或者 access\_token 无效。请开发者认真比对 AppSecret 的正确性，或查看是否正在为恰当的公众号调用接口 |
| 40013 | invalid appid | 不合法的 AppID ，请开发者检查 AppID 的正确性，避免异常字符，注意大小写 |
| 61004 | access clientip is not registered | 第三方平台出口IP未设置 |
| 61005 | component ticket is expired |  |
| 41004 | appsecret missing | 缺少 secret 参数 |
| 40125 | invalid appsecret view more at http://t.cn/RAEkdVq | 无效的appsecret |
| 61006 | component ticket is invalid |  |
| 61011 | invalid component |  |
| 45009 | reach max api daily quota limit | 调用超过天级别频率限制。可调用clear\_quota接口恢复调用额度。 |
| 47001 | data format error | 解析 JSON/XML 内容错误;post 数据中参数缺失;检查修正后重试。 |
| 48001 | api unauthorized | api 功能未授权，请确认公众号已获得该接口，可以在公众平台官网 - 开发者中心页中查看接口权限 |