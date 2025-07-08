## [#](#获取刷新令牌) 获取刷新令牌

[调试工具](https://developers.weixin.qq.com/apiExplorer?apiName=getAuthorizerRefreshToken&plat=thirdparty)

> 接口应在服务器端调用，详细说明参见[服务端API](https://developers.weixin.qq.com/miniprogram/dev/framework/server-ability/backend-api.html)。

## [#](#接口说明) 接口说明

### [#](#接口英文名) 接口英文名

getAuthorizerRefreshToken

### [#](#功能描述) 功能描述

+   当用户在第三方平台授权页中完成授权流程后，第三方平台开发者可以在回调 URI 中通过 URL 参数获取授权码(authorization\_code)。然后使用该接口可以换取公众号/小程序的刷新令牌（authorizer\_refresh\_token）。
+   建议保存授权信息中的刷新令牌（authorizer\_refresh\_token）使用过程中如遇到问题，可在[开放平台服务商专区](https://developers.weixin.qq.com/community/minihome/mixflow/1355698687267438595)发帖交流

### [#](#注意事项) 注意事项

+   公众号/小程序可以自定义选择部分权限授权给第三方平台，因此第三方平台开发者需要通过该接口来获取公众号/小程序具体授权了哪些权限，而不是简单地认为自己声明的权限就是公众号/小程序授权的权限。

## [#](#调用方式) 调用方式

### [#](#HTTPS-调用) HTTPS 调用

```text

POST https://api.weixin.qq.com/cgi-bin/component/api_query_auth?access_token=ACCESS_TOKEN 

```

### [#](#请求参数) 请求参数

| 属性 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| access\_token | string | 是 | 接口调用凭证，该参数为 URL 参数，非 Body 参数。使用[component\_access\_token](https://developers.weixin.qq.com/doc/oplatform/openApi/OpenApiDoc/ticket-token/getComponentAccessToken.html) |
| component\_appid | string | 是 | 第三方平台 appid |
| authorization\_code | string | 是 | 授权码, 会在授权成功时返回给第三方平台，详见[第三方平台授权流程说明](https://developers.weixin.qq.com/doc/oplatform/Third-party_Platforms/2.0/api/Before_Develop/Authorization_Process_Technical_Description.html)。该参数也可以通过平台推送的["授权变更通知"](https://developers.weixin.qq.com/doc/oplatform/Third-party_Platforms/2.0/api/ThirdParty/token/authorize_event.html)获取。 |

### [#](#返回参数) 返回参数

|  | 属性 | 类型 | 说明 |
| --- | --- | --- | --- |
|  | authorization\_info | object | 授权信息 |
|  | 
|  | 属性 | 类型 | 说明 |
| --- | --- | --- | --- |
|  | authorizer\_appid | string | 授权的公众号或者小程序 appid |
|  | authorizer\_access\_token | string | 接口调用令牌（在授权的公众号/小程序具备 API 权限时，才有此返回值） |
|  | expires\_in | number | authorizer\_access\_token 的有效期（在授权的公众号/小程序具备API权限时，才有此返回值），单位：秒 |
|  | authorizer\_refresh\_token | string | 刷新令牌（在授权的公众号具备API权限时，才有此返回值），刷新令牌主要用于第三方平台获取和刷新已授权用户的 authorizer\_access\_token。一旦丢失，只能让用户重新授权，才能再次拿到新的刷新令牌。用户重新授权后，之前的刷新令牌会失效 |
|  | func\_info | array<object> | 授权给第三方平台的权限集id列表，权限集id代表的含义可查看[权限集介绍](https://developers.weixin.qq.com/doc/oplatform/Third-party_Platforms/2.0/product/third_party_authority_instructions.html) |
|  | 
|  | 属性 | 类型 | 说明 |
| --- | --- | --- | --- |
|  | funcscope\_category | object | 授权给开发者的权限集详情 |
|  | 
|  | 属性 | 类型 | 说明 |
| --- | --- | --- | --- |
|  | id | number | 权限集id |
|  | type | number | 权限集类型 |
|  | name | string | 权限集名称 |
|  | desc | string | 权限集描述 |

 |

 |

 |

## [#](#调用示例) 调用示例

> 示例说明: HTTPS请求

### [#](#请求数据示例) 请求数据示例

```json

{
"component_appid":"appid_value" ,
"authorization_code": "auth_code_value"
} 

```

### [#](#返回数据示例) 返回数据示例

```json

{
  "authorization_info": {
    "authorizer_appid": "wxf8b4f85f3a794e77",
    "authorizer_access_token": "QXjUqNqfYVH0yBE1iI_7vuN_9gQbpjfK7hYwJ3P7xOa88a89-Aga5x1NMYJyB8G2yKt1KCl0nPC3W9GJzw0Zzq_dBxc8pxIGUNi_bFes0qM",
    "expires_in": 7200,
    "authorizer_refresh_token": "dTo-YCXPL4llX-u1W1pPpnp8Hgm4wpJtlR6iV0doKdY",
    "func_info": [
      {
        "funcscope_category": {
          "id": 1
        }
      },
      {
        "funcscope_category": {
          "id": 2
        }
      },
      {
        "funcscope_category": {
          "id": 3
        }
      }
    ]
  }
} 

```

### [#](#错误码) 错误码

| 错误码 | 错误码取值 | 解决方案 |
| --- | --- | --- |
| \-1 | system error | 系统繁忙，此时请开发者稍候再试 |
| 40001 | invalid credential  access\_token isinvalid or not latest | 获取 access\_token 时 AppSecret 错误，或者 access\_token 无效。请开发者认真比对 AppSecret 的正确性，或查看是否正在为恰当的公众号调用接口 |
| 40013 | invalid appid | 不合法的 AppID ，请开发者检查 AppID 的正确性，避免异常字符，注意大小写 |
| 0 | ok | ok |