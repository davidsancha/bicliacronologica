import { VideoEntry, WorshipEntry } from '../types';

export const DAILY_VIDEOS: Record<string, VideoEntry[]> = {
    "01/01": [{ id: "b_-j75V6O44", title: "Gênesis 1 - O Deus da Criação", channel: "Rev. Hernandes Dias Lopes" }]
};

export const DAILY_WORSHIP: Record<string, WorshipEntry[]> = {
    "10/06": [{ title: "Ouve, Senhor (Oração de Ezequias)", artist: "Diante do Trono", id: "2aFj4CaUsHk" }]
};

export const PRIORITY_CHANNELS = [
    { name: "Rev. Hernandes Dias Lopes", keyword: "Hernandes Dias Lopes", icon: "🔥" },
    { name: "IP Pinheiros", keyword: "Igreja Presbiteriana de Pinheiros", icon: "⛪" },
    { name: "Rev. Augustus Nicodemus", keyword: "Augustus Nicodemus", icon: "📚" }
];

export const PASTORS = [
    "Josué Valandro Jr", "André Valadão", "Rodrigo Silva", "Hernandes Dias Lopes", "Tiago Brunet"
];
