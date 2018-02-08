# Batch Posts plugin for NodeBB

Allows you to create several posts via uploading a text file, or via email (if the [Sendgrid](https://github.com/julianlam/nodebb-plugin-emailer-sendgrid) emailer plugin is enabled).

## Format

Use the following format in your text file / email:

```
############################################################
# 
# title: Your title here
# tags: Comma, delimited, tags, go, here
# uid: 1 (number, optional)
# cid: 1 (number, only required if posting via email)
# secret: ??? (find this in ACP, only required if via email)
#
############################################################

Article 1 goes here


############################################################
# 
# title: Your title here
# tags: Comma, delimited, tags, go, here
# uid: 1 (number, optional)
# cid: 1 (number, only required if posting via email)
# secret: ??? (find this in ACP, only required if via email)
#
############################################################

Article 2 goes here


############################################################
# 
# title: Your title here
# tags: Comma, delimited, tags, go, here
# uid: 1 (number, optional)
# cid: 1 (number, only required if posting via email)
# secret: ??? (find this in ACP, only required if via email)
#
############################################################

Article 3 goes here
```