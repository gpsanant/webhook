const Discord = require('discord.js');

module.exports = {
    parseEmbed(embed){
        return  {
                        color: embed.color, 
                        author: { name: embed.authorName, url: embed.authorURL, icon_url: embed.authorIcon },
                        title: embed.title,
                        url: embed.titleURL,
                        description: embed.description,
                        fields: embed.fields,
                        thumbnail: embed.thumbnail,
                        image: embed.image,
                        timestamp: embed.timestamp,
                        footer: { text: embed.footerText, icon_url: embed.footerIcon }
                    };
    },
    parseMessage(username, avatarUrl, content, embeds){
        return {
            compactMode: true,
            darkTheme: true, 
            webhookMode: true,
            username: username, 
            avatar_url: avatarUrl,
            error: "",
            data: {
                content: content,
                embed: false,
                embeds: embeds,
            }       
        }
    },
    convertMessage(content, username, avatarURL, embeds, hooks){
        embeds = this.convertEmbeds(embeds)
        var message = {}
        if(username !== "") message['username'] = username
        if(avatarURL !== "") message['avatarURL'] = avatarURL
        if(embeds.length > 0) message['embeds'] = embeds
        console.log(message)
        hooks.forEach((hook) => {
            hook = hook.val
            hook = hook.split('/')
            hook = new Discord.WebhookClient(hook[hook.length-2], hook[hook.length-1]);
            hook.send(content, message);
        })
    },
    convertEmbeds(embeds){
        var discordEmbeds = []
        for (let index = 0; index < embeds.length; index++) {
            const embed = embeds[index];
            var discordEmbed = new Discord.MessageEmbed().setColor(embed.color)
            if(embed.title !== ""){
                discordEmbed.setTitle(embed.title)
                if(embed.url !== "") discordEmbed.setURL(embed.url)
            }
            if(embed.author.name !== ""){
                if(embed.author.url !== ""){
                    if(embed.author.icon_url !== ""){ 
                        discordEmbed.setAuthor(embed.author.name, embed.author.icon_url, embed.author.url)
                    }else{
                        discordEmbed.setAuthor(embed.author.name, null, embed.author.url)
                    }
                }else if(embed.author.icon_url !== ""){
                    discordEmbed.setAuthor(embed.author.name, embed.author.icon_url)
                }else{
                    discordEmbed.setAuthor(embed.author.name)
                }
            }
            if(embed.description !== ""){
                discordEmbed.setDescription(embed.description)
            }
            if(embed.thumbnail !== ""){
                discordEmbed.setThumbnail(embed.thumbnail)
            }
            if(embed.fields.length >  0){
                discordEmbed.addFields(...embed.fields)
            }
            if(embed.image !== ""){
                discordEmbed.setImage(embed.image)
            }
            if(embed.timestamp !== ""){
                if(embed.timestamp === "now"){
                    discordEmbed.setTimestamp()
                }else{
                    discordEmbed.setTimestamp(Date.parse(embed.timestamp))
                }
            }
            if(embed.footer.text !== ""){
                if(embed.footer.icon_url !== ""){
                    discordEmbed.setFooter(embed.footer.text, embed.footer.icon_url)
                }else{
                    discordEmbed.setFooter(embed.footer.text)
                }
            }
            discordEmbeds[index] = discordEmbed;
        }
        return discordEmbeds;
    }
}