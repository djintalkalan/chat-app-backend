const stickers = [
    {
        id: 2,
        name: "sticker_2.jpg",
        voice: "tone_2.m4a",
        keyword: "how the josh"
    },
    {
        id: 3,
        name: "sticker_3.jpg",
        voice: "tone_3.mp3",
        keyword: "yeh baburao ka style hai"
    },
    {
        id: 4,
        name: "sticker_3.jpg",
        voice: "tone_3.mp3",
        keyword: "pushpa i Hate Tears"
    },
    {
        id: 5,
        name: "sticker_5.jpg",
        voice: "tone_5.mp3",
        keyword: "Jali ko Aag Kahte Hai"
    },
    {
        id: 6,
        name: "sticker_6.jpg",
        voice: "tone_3.mp3",
        keyword: "Sara Shehar Mujhe Lion Ke Naam Se Janta Hai"
    },
    {
        id: 7,
        name: "sticker_7.jpg",
        voice: "tone_3.mp3",
        keyword: "beta tumse na ho payega"
    },
    {
        id: 8,
        name: "sticker_8.jpg",
        voice: "tone_3.mp3",
        keyword: "Prem Naam Hai Mera Prem Chopra"
    },
    {
        id: 9,
        name: "sticker_9.jpg",
        voice: "tone_3.mp3",
        keyword: "Crime Master GoGo Naam Hai Mera"
    },
    {
        id: 10,
        name: "sticker_10.jpg",
        voice: "tone_10.mp3",
        keyword: "Tareekh Pe Tareekh"
    },
    {
        id: 11,
        name: "sticker_11.jpg",
        voice: "tone_11.mp3",
        keyword: "Main Tumhe Bhool Jau"
    },
    {
        id: 12,
        name: "sticker_12.jpg",
        voice: "tone_12.mp3",
        keyword: "Dosti Ka Ek Usool Hai Madam"
    },

    {
        id: 14,
        name: "sticker_14.jpg",
        voice: "tone_14.mp3",
        keyword: "Itna Sannata Kyun Hai Bhai"
    },
    {
        id: 15, name: "sticker_15.jpg",
        voice: "tone_15.mp3",
        keyword: "Mere karan Arjun Aayenge"
    },
    {
        id: 16,
        name: "sticker_16.jpg",
        voice: "tone_16.mp3",
        keyword: "Mere_man Ko Bhaya"
    },
    {
        id: 17,
        name: "sticker_17.jpg",
        voice: "tone_17.mp3",
        keyword: "Mogambo Khush Hua"
    },
    {
        id: 18,
        name: "sticker_18.jpg",
        voice: "tone_18.mp3",
        keyword: "Aa Gye Meri Maut Ka Tamasha dekhne"
    },
    {
        id: 19,
        name: "sticker_19.jpg",
        voice: "tone_19.mp3",
        keyword: "A Happy Woman Is Myth"
    },
    {
        id: 20,
        name: "sticker_20.jpg",
        voice: "tone_20.mp3",
        keyword: "Iss ilake mein nye Aaye Ho"
    },
    { id: 21, name: "sticker_21.jpg", voice: "tone_21.mp3", keyword: "Risthe Mein To Hum Tumhare Baap Lagte" },
    { id: 22, name: "sticker_22.jpg", voice: "tone_22.mp3", keyword: "Ab Tera Kya Hoga Kaliya" },
    { id: 23, name: "sticker_23.jpg", voice: "tone_23.mp3", keyword: "Kajal In Hatho Ne Sirf Hatiyar Chode Hai" },
    { id: 24, name: "sticker_24.jpg", voice: "tone_24.mp3", keyword: "Tumhara Ishq Ishq Aur Humara" },
    { id: 25, name: "sticker_25.jpg", voice: "tone_25.m4a", keyword: "Jab Log Tumhare Khilaf Bolne Lage" },
    { id: 27, name: "sticker_27.jpg", voice: "tone_27.m4a", keyword: "Humne Sapne Dekha Hindustan" },
    { id: 28, name: "sticker_28.jpg", voice: "tone_28.m4a", keyword: "Police Ki Goli Mein Itna" },
    { id: 30, name: "sticker_30.jpg", voice: "tone_30.m4a", keyword: "Aankh Dikhata Hai Madarjaat" },
    { id: 31, name: "sticker_31.jpg", voice: "tone_31.m4a", keyword: "Aap Humse Hamari Jindagi Maang Lete" },
    { id: 32, name: "sticker_32.jpg", voice: "tone_32.m4a", keyword: "Remember Life Is Race" },
    { id: 33, name: "sticker_33.jpg", voice: "tone_33.m4a", keyword: "Hamari Choriya Choro Se Kam Hai Kya" },
    { id: 34, name: "sticker_34.jpg", voice: "tone_34.m4a", keyword: "Ja Simran Ja Jee Le Apni Jindagi" },
    { id: 35, name: "sticker_35.jpg", voice: "tone_35.m4a", keyword: "Aata Majhi Satakli" },
    { id: 37, name: "sticker_37.jpg", voice: "tone_37.m4a", keyword: "Baap Ka Bhai Ka Dada Ka Sbka" },
    { id: 39, name: "sticker_39.jpg", voice: "tone_39.m4a", keyword: "Tum Ek Number Ke Chutiya Ho Shukla" },
    { id: 40, name: "sticker_40.jpg", voice: "tone_40.m4a", keyword: "O Bhosdiwale Chacha" },
    { id: 41, name: "sticker_41.jpg", voice: "tone_41.m4a", keyword: "Gand Na Phulaoo Maa Chod Denge" },
    { id: 42, name: "sticker_42.jpg", voice: "tone_42.m4a", keyword: "Gand Fate To Fate Par Nawabi Na Ghate" },
    { id: 43, name: "sticker_43.jpg", voice: "tone_43.m4a", keyword: "Uttamam Dadhattam Padam" },
    { id: 44, name: "sticker_44.jpg", voice: "tone_44.m4a", keyword: "Kahi Na Kahi Koi na Koi Mere Liye" },
    { id: 45, name: "sticker_45.jpg", voice: "tone_45.m4a", keyword: "Aag Ye Dil Mein lagi Use" },
    { id: 46, name: "sticker_46.jpg", voice: "tone_46.m4a", keyword: "Zindagi Ho To Smuggler Jaisi" },
    { id: 47, name: "sticker_47.jpg", voice: "tone_47.m4a", keyword: "Mohabbat Hai Isliye Jane Diya" },
    { id: 48, name: "sticker_48.jpg", voice: "tone_48.m4a", keyword: "Jab Tak Todenge Nahi Tab Tak Chodenge Nahi" },
    { id: 49, name: "sticker_49.jpg", voice: "tone_49.m4a", keyword: "Jis Mohabbat Mein" },
    { id: 50, name: "sticker_50.jpg", voice: "tone_50.m4a", keyword: "do Take Ki Jaan Lene Ke Liye" },
    { id: 51, name: "sticker_51.jpg", voice: "tone_51.m4a", keyword: "Bhosdike Iske Liye Tum Humare Darwaje Pe Chale Aye" },
    { id: 52, name: "sticker_52.jpg", voice: "tone_52.m4a", keyword: "Karara Jawab Milega" },
    { id: 53, name: "sticker_53.jpg", voice: "tone_53.m4a", keyword: "Leke Btaye Ya Deke" },
    { id: 54, name: "sticker_54.jpg", voice: "tone_54.m4a", keyword: "Mere Boyfriend Se Gullu Gullu Kregi To Thoku Gi Na" },
    { id: 56, name: "sticker_56.jpg", voice: "tone_56.m4a", keyword: "Munna Jhund Me To Suar Aate Hai" },
    { id: 58, name: "sticker_58.jpg", voice: "tone_58.m4a", keyword: "Ye Passion Hai Humara Passion" },
    { id: 60, name: "sticker_60.jpg", voice: "tone_60.m4a", keyword: "Jinke Apne Ghar Sheeshe Ke Ho Woh Doosron Par Pathar Nahi Phenka Karte" },
]
