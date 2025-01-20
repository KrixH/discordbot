# Discord Bot Projekt

Ez a projekt egy Discord bot, amely képes kezelni slash parancsokat, dinamikusan regisztrálni őketl.
- A bot funkcióit könnyen bővítheted, és biztonságosan tárolhatod az érzékeny adatokat az `.env` fájl segítségével.

---

## **Főbb Funkciók**

- **Slash parancsok kezelése**: A bot támogatja a slash parancsokat, amelyeket könnyen hozzáadhatsz és frissíthetsz.
- **Fejlesztői információ**: A bot parancson keresztül információt nyújt a fejlesztőről.
- **Biztonságos adatkezelés**: Az érzékeny adatok az `.env` fájlban vannak tárolva.
- **Több szerver támogatása**: A bot egyszerre több szerveren is képes parancsokat kezelni.

---

## **Használat**

### **1. Telepítés**

1. Klónozd a repository-t.
2. Telepítsd a szükséges komponenseket az `npm install` paranccsal.
3. Állítsd be az `.env` fájlt a szükséges információkkal, például a bot tokennel és a szerverek ID-jével.

### **2. Parancsok Regisztrálása**

Szerver specifikus regisztráció esetén a frissítés azonnal érvényesül, míg a globális parancsok frissítése akár 1 órát is igénybe vehet.
Esetleg ha új parancsot hoztál létre akkor futtasd a `node slashManage.js` parancsot az indítás előtt.

### **3. A Bot Futtatása**

Indítsd el a botot az `node index.js` paranccsal.

---

## **Kredit**
👨‍💻 **Fejlesztő**: KrixH  
🔗 **GitHub**: [KrixH/discordbot](https://github.com/KrixH/discordbot)

---
