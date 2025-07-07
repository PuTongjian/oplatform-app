## [#](#拉取已授权的账号信息) 拉取已授权的账号信息

[调试工具](https://developers.weixin.qq.com/apiExplorer?apiName=getAuthorizerList&plat=thirdparty)

> 接口应在服务器端调用，详细说明参见[服务端API](https://developers.weixin.qq.com/miniprogram/dev/framework/server-ability/backend-api.html)。

## [#](#接口说明) 接口说明

### [#](#接口英文名) 接口英文名

getAuthorizerList

### [#](#功能描述) 功能描述

使用本 API 拉取当前所有已授权的账号基本信息。

## [#](#调用方式) 调用方式

### [#](#HTTPS-调用) HTTPS 调用

```text

POST https://api.weixin.qq.com/cgi-bin/component/api_get_authorizer_list?access_token=ACCESS_TOKEN 

```

### [#](#请求参数) 请求参数

| 属性 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| access\_token | string | 是 | 接口调用凭证，该参数为 URL 参数，非 Body 参数。使用[component\_access\_token](https://developers.weixin.qq.com/doc/oplatform/openApi/OpenApiDoc/ticket-token/getComponentAccessToken.html) |
| component\_appid | string | 是 | 第三方平台 APPID |
| offset | number | 是 | 偏移位置/起始位置 |
| count | number | 是 | 拉取数量，最大为 500 |

### [#](#返回参数) 返回参数

|  | 属性 | 类型 | 说明 |
| --- | --- | --- | --- |
|  | total\_count | number | 授权的账号总数 |
|  | list | array<object> | 当前查询的账号基本信息列表 |
|  | 
|  | 属性 | 类型 | 说明 |
| --- | --- | --- | --- |
|  | authorizer\_appid | string | 已授权账号的 appid |
|  | refresh\_token | string | 刷新令牌authorizer\_refresh\_token |
|  | auth\_time | number | 授权的时间 |

 |

## [#](#调用示例) 调用示例

> 示例说明: HTTPS请求示例

### [#](#请求数据示例) 请求数据示例

```json

{
  "component_appid": "appid_value",
  "offset": 0,
  "count": 100
} 

```

### [#](#返回数据示例) 返回数据示例

```json

{
  "total_count": 33,
  "list": [
    {
      "authorizer_appid": "authorizer_appid_1",
      "refresh_token": "refresh_token_1",
      "auth_time": 1558000607
    },
    {
      "authorizer_appid": "authorizer_appid_2",
      "refresh_token": "refresh_token_2",
      "auth_time": 1558000607
    }
  ]
}
 

```

### [#](#错误码) 错误码

| 错误码 | 错误码取值 | 解决方案 |
| --- | --- | --- |
| \-1 | system error | 系统繁忙，此时请开发者稍候再试 |
| 40001 | invalid credential  access\_token isinvalid or not latest | 获取 access\_token 时 AppSecret 错误，或者 access\_token 无效。请开发者认真比对 AppSecret 的正确性，或查看是否正在为恰当的公众号调用接口 |
| 40013 | invalid appid | 不合法的 AppID ，请开发者检查 AppID 的正确性，避免异常字符，注意大小写 |
| 0 | ok | ok |
| 40170 | args count exceed count limit | 个数超出限制 |