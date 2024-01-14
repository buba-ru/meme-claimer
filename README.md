# Чекер поинтов Meme Farming
Проверяет кол-во поинтов на адресе (в том числе реферальные).  
Результаты сохраняются в файл `result.txt` в формате `address;you_points;referal_points`  

```
0x7b12e3991C21e3Cd845f4839B82DF8eFCC1b78C4;12558;0
0x360AE6E52BDf7CD949070238573bC7DB2fE7e279;12558;0
0x5229671B8D51712D7669cD8A6491721b4a9C8ef4;12558;0
0x48C1D08D75e43eaab8597A52C2befd280c1c11d3;12558;0
0x54fdDDE45e920165Ca9882cEe41B36Cf67a6a8Bb;12558;0
```

## Настройка
В файл `userData/private.keys` добавить приватные ключи для проверки. Каждый с новой строки.  
В файл `userData/proxy.js` добавить прокси в формате  
```javascript
export default {
    server: 'http://user:password@101.241.1.101:11223',
    change_ip_url: 'http://change-ip-url',
}
```
Прокси обновляется после каждого адреса. Пауза между обновлениями 30 сек.

## Как использовать
Скачать код `git clone`  
Перейти в папку с кодом `cd meme-claimer`  
Установить зависимости `npm install`  
Запуск `node index.js`


###### Задать вопрос автору: [Telegram](https://t.me/buba_ru)
