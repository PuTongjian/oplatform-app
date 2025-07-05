## [#](#将草稿添加到模板库) 将草稿添加到模板库

[调试工具](https://developers.weixin.qq.com/apiExplorer?apiName=addToTemplate&plat=thirdparty)

> 接口应在服务器端调用，详细说明参见[服务端API](https://developers.weixin.qq.com/miniprogram/dev/framework/server-ability/backend-api.html)。

## [#](#接口说明) 接口说明

### [#](#接口英文名) 接口英文名

addToTemplate

### [#](#功能描述) 功能描述

该接口用于将草稿添加到模板库设置为持久的代码模板。使用过程中如遇到问题，可在开放[平台服务商专区](https://developers.weixin.qq.com/community/minihome/mixflow/1355698687267438595)发帖交流。

## [#](#调用方式) 调用方式

### [#](#HTTPS-调用) HTTPS 调用

```text

POST https://api.weixin.qq.com/wxa/addtotemplate?access_token=ACCESS_TOKEN 

```

### [#](#请求参数) 请求参数

| 属性 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| access\_token | string | 是 | 接口调用凭证，该参数为 URL 参数，非 Body 参数。使用[component\_access\_token](https://developers.weixin.qq.com/doc/oplatform/openApi/OpenApiDoc/ticket-token/getComponentAccessToken.html) |
| draft\_id | number | 是 | 草稿 ID |
| template\_type | number | 否 | 默认值是0，对应普通模板；可选1，对应标准模板库，关于标准模板库和普通模板库的区别可以查看[小程序模板库介绍](https://developers.weixin.qq.com/doc/oplatform/Third-party_Platforms/2.0/operation/thirdparty/template.html) |

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
| 85065 | template list is full | 模板库已满 |