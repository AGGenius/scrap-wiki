const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();

const basUrl = 'https://es.wikipedia.org/';
const rapMusicians = 'wiki/Categor%C3%ADa:M%C3%BAsicos_de_rap';

const artistsArr = [];

app.get(('/'), (req, res) => {
    axios.get(basUrl + rapMusicians).then((response) => {
        if (response.status === 200) {
            const htmlBase = response.data;

            const $ = cheerio.load(htmlBase);

            const rapMusiciansLinks = [];
            const rapMusiciansPromises = [];

            //Dentro del id "mw-pages" cogemos todos los elementos "a".
            $('#mw-pages a').each((i, el) => {
                const link = $(el).attr('href');
                rapMusiciansLinks.push(basUrl + link);
            });

            // Creamos un array de promesas para poder pasar al Promise.all.
            rapMusiciansLinks.forEach((element) => {
                const promise = axios.get(element);
                rapMusiciansPromises.push(promise);
            })

            Promise.all(rapMusiciansPromises).then((response) => {

                response.forEach((elemment) => {
                    if(elemment.status === 200) {
                        const musicianHtml = elemment.data;

                        $2 = cheerio.load(musicianHtml);

                        const imgs = [];
                        const texts = [];
                        const artist = {
                            title: '',
                            imgs: [],
                            texts: []
                        }

                        $2('img').each((i, el) => {
                            imgs.push($(el).attr('src'));
                        })

                        $2('p').each((i, el) => {
                            texts.push($(el).text());
                        })
                        
                        artist.title = $2('h1').text();
                        artist.imgs = imgs;
                        artist.texts = texts;
                        
                        artistsArr.push(artist);
                    }
                });

                res.redirect('/data');
            });
        }
    });
});

app.get(('/data'), (req, res) => {
    res.send(artistsArr);
});

app.listen(3000, () => {
    console.log('Express está ejecutandose en http://localhost:3000');
});