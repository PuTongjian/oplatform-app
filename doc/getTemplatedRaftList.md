## [#](#获取草稿箱列表) 获取草稿箱列表

[调试工具](https://developers.weixin.qq.com/apiExplorer?apiName=getTemplatedRaftList&plat=thirdparty)

> 接口应在服务器端调用，详细说明参见[服务端API](https://developers.weixin.qq.com/miniprogram/dev/framework/server-ability/backend-api.html)。

## [#](#接口说明) 接口说明

### [#](#接口英文名) 接口英文名

getTemplatedRaftList

### [#](#功能描述) 功能描述

+   通过本接口，可以获取第三方平台草稿箱中所有的草稿；
+   说明，草稿是由第三方平台的开发小程序在使用微信开发者工具上传的。使用过程中如遇到问题，可在[开放平台服务商专区](https://developers.weixin.qq.com/community/minihome/mixflow/1355698687267438595)发帖交流。

## [#](#调用方式) 调用方式

### [#](#HTTPS-调用) HTTPS 调用

```text

GET https://api.weixin.qq.com/wxa/gettemplatedraftlist?access_token=ACCESS_TOKEN 

```

### [#](#请求参数) 请求参数

### [#](#返回参数) 返回参数

|  | 属性 | 类型 | 说明 |
| --- | --- | --- | --- |
|  | errcode | number | 错误码 |
|  | errmsg | string | 错误信息 |
|  | draft\_list | array<object> | 草稿箱信息 |
|  | 
|  | 属性 | 类型 | 说明 |
| --- | --- | --- | --- |
|  | create\_time | number | 开发者上传草稿时间戳 |
|  | user\_version | string | 版本号，开发者自定义字段 |
|  | user\_desc | string | 版本描述 开发者自定义字段 |
|  | draft\_id | number | 草稿 id |
|  | source\_miniprogram\_appid | string | 开发小程序的appid |
|  | source\_miniprogram | string | 开发小程序的名称 |
|  | developer | string | 操作者微信昵称 |

 |

## [#](#调用示例) 调用示例

> 示例说明: HTTPS请求示例

### [#](#请求数据示例) 请求数据示例

```json

GET https://api.weixin.qq.com/wxa/gettemplatedraftlist?access_token=ACCESS_TOKEN 

```

### [#](#返回数据示例) 返回数据示例

```json

{
  "errcode": 0,
  "errmsg": "ok",
  "draft_list": [
    {
      "create_time": 1488965944,
      "user_version": "VVV",
      "user_desc": "AAS",
      "draft_id": 0,
      "source_miniprogram_appid": "wx6XXXXXXXXXXXXXXX",
      "source_miniprogram": "LXXXXX",
      "developer": "XXX",
      "category_list": []
    },
    {
      "create_time": 1504790906,
      "user_version": "11",
      "user_desc": "111111",
      "draft_id": 4,
      "source_miniprogram_appid": "wx6XXXXXXXXXXXXXXX",
      "source_miniprogram": "LXXXXX",
      "developer": "XXX",
      "category_list": []
    }
  ]
} 

```

### [#](#错误码) 错误码

| 错误码 | 错误描述 | 解决方案 |
| --- | --- | --- |
| 40001 | invalid credential  access\_token isinvalid or not latest | 获取 access\_token 时 AppSecret 错误，或者 access\_token 无效。请开发者认真比对 AppSecret 的正确性，或查看是否正在为恰当的公众号调用接口 |
| 85064 | template not found | 找不到模板 |
| \-1 | system error | 系统繁忙，此时请开发者稍候再试 |