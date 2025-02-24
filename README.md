# Rule 34 Downloader

This app can download images that are grouped by tags in rule34 website.

### Usage

```sh
# installation
git clone https://github.com/dwizulyan/r34-new.git

# Installing the required package
cd ./r34-new
npm i

# Using the app
# If you have tsx installed globally
tsx app [tags]

# else
npm start [tags]

```

The format of the tags should be like this :

`tag_1 tag_2 tag_3 etc`

if you combine more than 1 tags use space to separate the tags like above. Also dont forget to use quote.

`"tag_1 tag_2 tag_3 etc"` like this.

### Customize setting

The app setting are in the `/utils/setting.ts` file.
