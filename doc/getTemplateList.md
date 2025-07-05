## [#](#获取模板列表) 获取模板列表

[调试工具](https://developers.weixin.qq.com/apiExplorer?apiName=getTemplateList&plat=thirdparty)

> 接口应在服务器端调用，详细说明参见[服务端API](https://developers.weixin.qq.com/miniprogram/dev/framework/server-ability/backend-api.html)。

## [#](#接口说明) 接口说明

### [#](#接口英文名) 接口英文名

getTemplateList

### [#](#功能描述) 功能描述

通过该接口可以获取模板库里的模板列表信息。使用过程中如遇到问题，可在[开放平台服务商专区](https://developers.weixin.qq.com/community/minihome/mixflow/1355698687267438595)发帖交流

### [#](#注意事项) 注意事项

请求方式是get，不是post。如果之前使用了post请求的用户，请切换成get

## [#](#调用方式) 调用方式

### [#](#HTTPS-调用) HTTPS 调用

```text

GET https://api.weixin.qq.com/wxa/gettemplatelist?access_token=ACCESS_TOKEN 

```

### [#](#请求参数) 请求参数

| 属性 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| access\_token | string | 是 | 接口调用凭证，该参数为 URL 参数，非 Body 参数。使用[component\_access\_token](https://developers.weixin.qq.com/doc/oplatform/openApi/OpenApiDoc/ticket-token/getComponentAccessToken.html) |
| template\_type | number | 否 | 可选是0（对应普通模板）和1（对应标准模板），如果不填，则返回全部的。关于标准模板和普通模板的区别可查看[小程序模板库介绍](https://developers.weixin.qq.com/doc/oplatform/Third-party_Platforms/2.0/operation/thirdparty/template.html) |

### [#](#返回参数) 返回参数

|  | 属性 | 类型 | 说明 |
| --- | --- | --- | --- |
|  | errcode | number | 错误码 |
|  | errmsg | string | 错误信息 |
|  | template\_list | array<object> | 模板信息列表 |
|  | 
|  | 属性 | 类型 | 说明 |
| --- | --- | --- | --- |
|  | create\_time | number | 开发者上传草稿时间戳 |
|  | user\_version | string | 版本号，开发者自定义字段 |
|  | user\_desc | string | 版本描述 开发者自定义字段 |
|  | template\_id | number | 模板 id |
|  | draft\_id | number | 草稿 id |
|  | source\_miniprogram\_appid | string | 开发小程序的appid |
|  | source\_miniprogram | string | 开发小程序的名称 |
|  | template\_type | number | 0对应普通模板，1对应标准模板 |
|  | category\_list | array<object> | 标准模板的类目信息；如果是普通模板则值为空的数组 |
|  | 
|  | 属性 | 类型 | 说明 |
| --- | --- | --- | --- |
|  | address | string | 小程序的页面，可通过"获取小程序的页面列表getCodePage"接口获得 |
|  | tag | string | 小程序的标签，用空格分隔，标签至多 10 个，标签长度至多 20 |
|  | first\_class | string | 一级类目名称，可通过"getAllCategoryName"接口获取 |
|  | second\_class | string | 二级类目名称，可通过"getAllCategoryName"接口获取 |
|  | third\_class | string | 三级类目名称，可通过"getAllCategoryName"接口获取 |
|  | title | string | 小程序页面的标题,标题长度至多 32 |
|  | first\_id | number | 一级类目id，可通过"getAllCategoryName"接口获取 |
|  | second\_id | number | 二级类目id，可通过"getAllCategoryName"接口获取 |
|  | third\_id | number | 三级类目id，可通过"getAllCategoryName"接口获取 |

 |
|  | audit\_scene | number | 标准模板的场景标签；普通模板不返回该值 |
|  | audit\_status | number | 标准模板的审核状态；普通模板不返回该值 |
|  | reason | string | 标准模板的审核驳回的原因，；普通模板不返回该值 |

 |

## [#](#其他说明) 其他说明

### [#](#audit-status的值) audit\_status的值

| 状态码 | 说明 |
| --- | --- |
| 0 | 未提审核 |
| 1 | 审核中 |
| 2 | 审核驳回 |
| 3 | 审核通过 |
| 4 | 提审中 |
| 5 | 提审失败 |

## [#](#调用示例) 调用示例

> 示例说明: HTTPS请求示例

### [#](#请求数据示例) 请求数据示例

### [#](#返回数据示例) 返回数据示例

```json

{
  "errcode": 0,
  "errmsg": "ok",
  "template_list": [
    {
            "create_time": 1624000154,
            "user_version": "1.0.0",
            "user_desc": "尝试提交草稿箱",
            "template_id": 47,
            "source_miniprogram_appid": "wxxxxxx",
            "source_miniprogram": "测试测试测试234",
            "developer": "。",
            "template_type": 1,
            "category_list": [
                {
                    "first_class": "工具",
                    "second_class": "效率",
                    "first_id": 287,
                    "second_id": 616
                }
            ],
            "audit_scene": 0,
            "audit_status": 2,
            "reason": ""
    },
    {
      "create_time": 1624849691,
            "user_version": "1.0.0",
            "user_desc": "尝试提交草稿箱",
            "template_id": 48,
            "source_miniprogram_appid": "wxxxxxx",
            "source_miniprogram": "测试测试测试234",
            "developer": "。",
            "template_type": 1,
            "category_list": []
    }
  ]
} 

```

### [#](#错误码) 错误码

| 错误码 | 错误码取值 | 解决方案 |
| --- | --- | --- |
| 40001 | invalid credential  access\_token isinvalid or not latest | 获取 access\_token 时 AppSecret 错误，或者 access\_token 无效。请开发者认真比对 AppSecret 的正确性，或查看是否正在为恰当的公众号调用接口 |
| 43001 | require GET method | 需要 GET 请求 |
| 85064 | template not found | 找不到模板 |
| 0 | ok | ok |
| \-1 | system error | 系统繁忙，此时请开发者稍候再试 |