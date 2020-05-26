const fs = require('fs');
const endOfLine = require('os').EOL;

class SitemapXML {
  constructor(indexFilePath, baseUrl) {
    const data = fs.readFileSync(indexFilePath);

    this.data = JSON.parse(data).pages;
    this.baseUrl = baseUrl;
    this.writeFile();
  }
  makeSitemap() {
    let buffer = [];

    buffer.push('<?xml version="1.0" encoding="UTF-8"?>');
    buffer.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

    this.data.forEach((page) => {
      buffer.push(this.createURLElement(page));
    });

    buffer.push('</urlset>');

    return buffer.join(endOfLine);
  }
  createURLElement(data) {
    let buffer = [];

    if (typeof data['url'] === 'undefined' || data['url']  === '') {
      throw '"link" key must be assigned a value.';
    }

    buffer.push('<url>');

    buffer.push(this.createElement('loc', this.baseUrl + encodeURI(data['url'])));

    // // optional elements
    // last mod --- Not a good way to do this
    // buffer.push(this.createElement('lastmod', this.getLastModifiedDate(this.srcFilePath + data['url'] + '/index.php')));
    
    if (typeof data['change-frequency'] !== 'undefined' || data['change-frequency'] !== '') {
      this.createElement('changefreq', data['change-frequency']);
    }

    if (typeof data['priority'] !== 'undefined' || data['priority'] !== '') {
      this.createElement('priority', data['priority']);
    }

    buffer.push('</url>')

    return buffer.join(endOfLine);
  }

  getLastModifiedDate(file) {
    const mtime = fs.statSync(file).mtime;

    return mtime.toISOString();
  }
  createElement(name, value) {
    return (`<${name}>${value}</${name}>`);
  }

  writeFile(filename = './src/sitemap.xml') {
    const sitemap = this.makeSitemap();

    fs.writeFileSync(filename, sitemap);
    console.log('Site map file created.');
  }
}
module.exports = SitemapXML;