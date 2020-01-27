import axios from 'axios'

const API = axios.create({
    baseURL: 'http://018t122.mars-e1.mars-hosting.com'
})

export default {
    promenaSifre: params => API.put('kuvarApi/outh/user', params),
    deleteKorisnika: params => API.delete('kuvarApi/outh/user', params),
    brisanjeRecepta: params => API.delete('kuvarApi/recepti', params),
    receptiFavoriti: params => API.get('kuvarApi/recepti/favorites', params),
    receptiKategorije: params => API.get('kuvarApi/kategorije', params),
    login: params => API.post('/kuvarApi/outh/login', params),
    logout: params => API.get('/kuvarApi/outh/logout', params),
    user: params => API.post('/kuvarApi/outh/user', params),
    showUsers: params => API.get('kuvarApi/outh/showUsers', params),
    namirnice: params => API.get('kuvarApi/namirnice', params),
    namirniceAdd: params => API.post('kuvarApi/namirnice', params),
    namirniceEdit: params => API.put('kuvarApi/namirnice', params),
    namirniceDelete: params => API.delete('kuvarApi/namirnice', params),
    showRecipes: params => API.get('/kuvarApi/recepti', params),
    showRecipesEdit: params => API.put('/kuvarApi/recepti', params),
    showRecipesDelete: params => API.delete('/kuvarApi/recepti', params),
    showKomentare: params => API.get('/kuvarApi/komentari', params),
    showKomentareEdit: params => API.put('kuvarAPI/komentari', params),
    showKomentareDelete: params => API.delete('kuvarAPI/komentari', params),
    showKomentareOdobri: params => API.patch('kuvarAPI/komentari', params),
    insertKomentare: params => API.post('kuvarApi/komentari', params),
    korisnikPrivilegija: params => API.patch('kuvarApi/outh/user', params),
    sveNamirnice: params => API.get('kuvarApi/namirnice/namRecInsert', params),
    unesiRecept: params => API.post('kuvarApi/recepti', params),
    unesiSliku: params => API.patch('kuvarApi/recepti/pojedinacno', params),
    kontakt: params => API.post('kuvarApi/kontakt', params),
    regPotvrda: params => API.post('kuvarApi/regPotvrda', params),
    unosFavorita: params => API.post('kuvarApi/recepti/favorites', params),
    receptiPojedinacno: params => API.get('kuvarApi/recepti/recNamKor', params),
    receptiOdobri: params => API.patch('kuvarApi/recepti', params),
    mojiFavoriti: params => API.get('kuvarApi/recepti/favorites/myFavorites', params),
    prikaziObroke: params => API.get('kuvarApi/obroci', params),
    posaljiPoruku: params => API.post('kuvarApi/outh/poruka', params),
    aboutGet: params => API.get('kuvarApi/about', params),
    aboutPost: params => API.post('kuvarApi/about', params),
    about: params => API.get('kuvarApi/about', params),
    obrisiNamirnicuIzRecepta: params => API.delete('kuvarApi/recepti/recNamKor', params),
    dodajNamirnicuURecept: params => API.post('kuvarApi/recepti/recNamKor', params),
    proveraSesije: params => API.post('kuvarAPI/outh/proveraSesije', params)

}