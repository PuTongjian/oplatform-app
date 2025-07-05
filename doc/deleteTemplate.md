## [#](#删除代码模板) 删除代码模板

[调试工具](https://developers.weixin.qq.com/apiExplorer?apiName=deleteTemplate&plat=thirdparty)

> 接口应在服务器端调用，详细说明参见[服务端API](https://developers.weixin.qq.com/miniprogram/dev/framework/server-ability/backend-api.html)。

## [#](#接口说明) 接口说明

### [#](#接口英文名) 接口英文名

deleteTemplate

### [#](#功能描述) 功能描述

通过该接口可以删除指定的模板。因为代码模板库的模板数量是有上限的，当达到上限或者有某个模板不再需要时，建议调用本接口删除指定的代码模板。使用过程中如遇到问题，可在[开放平台服务商专区](https://developers.weixin.qq.com/community/minihome/mixflow/1355698687267438595)发帖交流。

## [#](#调用方式) 调用方式

### [#](#HTTPS-调用) HTTPS 调用

```text

POST https://api.weixin.qq.com/wxa/deletetemplate?access_token=ACCESS_TOKEN 

```

### [#](#请求参数) 请求参数

| 属性 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| access\_token | string | 是 | 接口调用凭证，该参数为 URL 参数，非 Body 参数。使用[component\_access\_token](https://developers.weixin.qq.com/doc/oplatform/openApi/OpenApiDoc/ticket-token/getComponentAccessToken.html) |
| template\_id | number | 是 | 要删除的模板 ID ，可通过获取模板列表接口（https://developers.weixin.qq.com/doc/oplatform/Third-party\_Platforms/2.0/api/ThirdParty/code\_template/gettemplatelist.html）获取。 |

### [#](#返回参数) 返回参数

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| errcode | number | 错误码 |
| errmsg | string | 错误信息 |

## [#](#调用示例) 调用示例

> 示例说明: HTTPS请求示例

### [#](#请求数据示例) 请求数据示例

### [#](#返回数据示例) 返回数据示例

```json

{
  "errcode": 0,
  "errmsg": "ok"
} 

```

### [#](#错误码) 错误码

| 错误码 | 错误码取值 | 解决方案 |
| --- | --- | --- |
| \-1 | system error | 系统繁忙，此时请开发者稍候再试 |
| 40001 | invalid credential  access\_token isinvalid or not latest | 获取 access\_token 时 AppSecret 错误，或者 access\_token 无效。请开发者认真比对 AppSecret 的正确性，或查看是否正在为恰当的公众号调用接口 |
| 85064 | template not found | 找不到模板 |