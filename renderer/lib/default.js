function defaultMessage(idx){ 
    return {
        "title": "New Message",
        "content": "this view `supports` __a__ **subset** *of* ~~markdown~~ 😃 ```hello```although __all markdown will be translated correctly to when the webhook is sent even if you can't see it in the view__",
        "username": "Webhook Man",
        "avatar": "https://4.bp.blogspot.com/-vA5ZlQff9sM/TsxfxvHHmJI/AAAAAAAAEyY/3KcDKj8-_dI/s400/lord-brahma-hindu-god-of-creation.jpg",
        "embeds": [
          {
            "title": "This is an embed",
            "description": "You can add guided links to your embed's description and field values [like this](https://google.com)! Just make sure to click all of the links before you send to make sure they're correct :slight_smile:",
            "author": {
              "name": "Author Name",
              "url": "https://google.com",
              "icon_url": "https://4.bp.blogspot.com/-vA5ZlQff9sM/TsxfxvHHmJI/AAAAAAAAEyY/3KcDKj8-_dI/s400/lord-brahma-hindu-god-of-creation.jpg"
            },
            "footer": {
              "text": "Footer Text",
              "icon_url": "https://4.bp.blogspot.com/-vA5ZlQff9sM/TsxfxvHHmJI/AAAAAAAAEyY/3KcDKj8-_dI/s400/lord-brahma-hindu-god-of-creation.jpg"
            },
            "color": '#ffffff',
            "timestamp": "2420-04-20T23:20:00Z",
            "fields": [
              {
                "inline": false,
                "name": "🤔",
                "value": "hmmmm"
              },
              {
                "inline": true,
                "name": ":santa:",
                "value": "here is your present"
              },
              {
                "inline": true,
                "name": ":no_smoking:",
                "value": "For longevity"
              }
            ],
            "image": "",
            "url": "https://google.com",
            "thumbnail": "https://4.bp.blogspot.com/-vA5ZlQff9sM/TsxfxvHHmJI/AAAAAAAAEyY/3KcDKj8-_dI/s400/lord-brahma-hindu-god-of-creation.jpg"
          }
        ],
        "webhooks": [
          {val: "", err: false}
        ],
        "timestamp": Date.now(),
        "idx": idx
      }
}

export default defaultMessage;

