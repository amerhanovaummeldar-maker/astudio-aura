# А&А Beauty Studio

FINAL PROMPT FOR LOVABLE — «А&Астудия» REAL WEB APPLICATION

Build a real, functional, mobile-first web application for a premium hair studio called «А&Астудия».

This must NOT be a static landing page or visual mockup.
Build a working application with real navigation, working buttons, forms, database structure, authentication, file uploads, admin panel, portfolio management, booking flow, and editable content.

1. LANGUAGE — VERY IMPORTANT

The entire user-facing application must be in Russian.

This includes:

navigation

buttons

headings

forms

error messages

notifications

booking

AI hair consultation

virtual mirror

chat assistant

gift certificates

portfolio

reviews

articles

admin panel

settings

all system messages

Do not display English interface text to users.

Technical code, database field names and internal implementation may be in English.

2. STUDIO INFORMATION

Studio name:

А&Астудия

Location:

МО, г. Коломна

Phone:

8-916-364-94-74

The phone number must be clickable on smartphones and open the phone call interface.

Do not invent:

address

phone numbers

stylists

reviews

prices

services

logos

portfolio photographs

The studio information must be editable from the admin panel.

3. BRANDING AND VISUAL STYLE

Style:

Quiet Luxury

The design should feel:

premium

elegant

feminine

calm

modern

tasteful

professional

minimalist

Main color:

Powder Pink #F4D0D0

Supporting colors:

milk white

warm white

soft beige

coffee with milk

taupe

dark gray / graphite

Use generous whitespace.

Use elegant serif typography for major headings and a clean modern sans-serif font for body text.

Animations should be subtle and elegant.

Avoid:

excessive decoration

bright colors

cheap-looking beauty salon aesthetics

visual clutter

unnecessary gradients

excessive animation

4. MOBILE-FIRST DESIGN

The application must be designed primarily for smartphones.

It must work comfortably on:

iPhone

Android phones

tablets

desktop

Important:
The owner must be able to manage the application from an iPhone.

Buttons and controls must have comfortable touch targets.

Photos and videos must be easy to upload directly from an iPhone.

Support vertical 9:16 videos.

5. HEADER

Create a clean premium header.

Display:

А&Астудия

Navigation:

Главная

Услуги

Портфолио

Тест волос

Примерить образ

Уход

Подарочный сертификат

Запись

Контакты

Add prominent buttons:

Записаться

Позвонить

Also provide WhatsApp and Telegram contact buttons.

The phone number must be:

8-916-364-94-74

6. HERO SECTION

Logo / studio name:

А&Астудия

Main headline:

«Ваш идеальный образ начинается здесь»

Subheadline:

«Персональный уход, цвет и стиль, подобранные именно для вас.»

Buttons:

Записаться

Пройти тест волос

Also provide quick contact actions:

Позвонить

WhatsApp

Telegram

7. AI HAIR CONSULTATION

Create a section:

«Тест волос»

This is a beauty consultation, NOT a medical diagnostic tool.

Show progress:

Шаг 1 из 5

The user must be able to go back and edit previous answers.

Question 1

«Какие у вас волосы сейчас?»

Options:

Сухие

Нормальные

Жирные у корней

Сухие по длине, жирные у корней

Question 2

«Где вы обычно красите волосы?»

Options:

Дома

В салоне

Иногда дома, иногда в салоне

Сейчас не крашу

Question 3

«Есть ли у вас сейчас окрашивание или осветление?»

Options:

Блонд / осветление

Окрашивание в тёмные оттенки

Мелирование

Натуральные волосы

Другое

Question 4

«Что вас сейчас больше всего беспокоит?»

Options:

Сухость

Ломкость

Отсутствие блеска

Седина

Нежелательный оттенок

Хочу изменить образ

Question 5

«Какого результата вы хотите?»

Options:

Красивый естественный цвет

Восстановить и увлажнить волосы

Изменить цвет

Новую стрижку

Завивку

Подобрать комплексный уход

After completion show:

«Ваша персональная рекомендация»

Display:

recommended service

explanation

optional additional service

price if configured

button «Записаться»

button «Посмотреть услуги»

Recommendation logic must be editable from the admin panel.

Do not make medical claims.

8. VIRTUAL MIRROR

Create a section:

«Примерьте новый образ»

The user can upload a photograph from a phone.

Options:

Примерить стрижку

Попробовать новый цвет

Попробовать завивку

Flow:

Upload photo

Select desired transformation

Show result

IMPORTANT:

Do not pretend that AI image transformation exists if no AI API is connected.

Create a real photo-upload interface and prepare a clean integration point for a future AI virtual try-on API.

9. SERVICES

Create a services section.

Categories:

Стрижки

Окрашивание

Блонд / осветление

Работа с сединой

Уходы

Завивка

Укладка

Each service must support:

name

description

price

duration

category

booking button

The owner must be able to:

add service

edit service

delete service

change price

change description

change category

change duration

Never invent prices.

10. PORTFOLIO

Create a premium portfolio.

Categories:

Окрашивание

Блонд

Седина

Стрижки

Уход

Завивка

До / После

The owner must be able to upload her own:

photographs

short videos

IMPORTANT:

The owner must be able to upload videos directly from her iPhone.

Simple admin flow:

Добавить работу → выбрать фото или видео → загрузить → выбрать категорию → добавить описание → Опубликовать

The owner must be able to:

add

delete

replace

reorder

categorize

add descriptions

hide/show portfolio items

Support:

photos

vertical 9:16 videos

short videos

Do NOT automatically replace the owner’s content with random external photographs.

11. VIDEO PORTFOLIO

Create a separate video-capable portfolio area.

The owner can upload short videos from her phone.

The videos should appear publicly after publishing.

Provide:

upload

preview

category

description

publish

hide

delete

reorder

Use Supabase Storage or another reliable storage solution.

12. AI BEAUTY ASSISTANT

Add a floating chat assistant.

Initial message:

«Здравствуйте! Какой образ мы сегодня создаём?»

The assistant should be able to answer questions about:

services

prices

hair care

procedures

booking

portfolio

general information about А&Астудия

The assistant must use only information stored in the application’s knowledge/content system.

It must NEVER invent:

prices

services

availability

staff

reviews

studio information

Prepare the architecture for a future AI API.

The knowledge/content must be editable by the owner.

13. BOOKING

Create a real booking flow.

User selects:

service

date

available time

name

phone

optional comment

Then show confirmation.

Prepare integration architecture for:

Google Calendar

WhatsApp

Telegram

email notifications

The owner must be able to manage:

working hours

services

bookings

14. GIFT CERTIFICATES

Create:

«Подарите красоту»

User can:

choose amount

enter recipient name

enter sender name

add personal message

choose design

preview certificate

download elegant PDF or image

Payment integration can be added later.

15. AFTERCARE / BEAUTY ARTICLES

Create a section:

«Секрет долго сохраняющейся красоты»

Include articles/tips about:

color maintenance

blonde care

shine

treatments

home hair care

The owner must be able to:

create

edit

delete

publish

hide articles

16. REVIEWS

Create a reviews section.

Review structure:

client name

review text

optional photo

date

The owner can:

add

edit

delete

hide

publish

IMPORTANT:

Do not create fake reviews.

17. CONTACTS

Create a contacts section containing:

А&Астудия

МО, г. Коломна

8-916-364-94-74

Buttons:

Позвонить

WhatsApp

Telegram

Social links must be editable from the admin panel.

Do not invent social media URLs.

18. ADMIN PANEL

Create a protected admin panel.

Only authorized administrators can access it.

Admin sections:

Главная

Услуги

Портфолио

Видео

Фотографии

Тест волос

Рекомендации

Отзывы

Уход

Подарочные сертификаты

Записи

Настройки

The admin panel must also work comfortably on an iPhone.

19. ADMIN SETTINGS

Allow the owner to edit:

studio name

logo

address

phone

WhatsApp

Telegram

social links

working hours

homepage texts

images

contact information

Initial values:

Studio name:
А&Астудия

Location:
МО, г. Коломна

Phone:
8-916-364-94-74

20. DATABASE

Prefer Supabase for:

Database

Authentication

Storage

Create appropriate structures for:

services

service categories

portfolio items

portfolio categories

videos

photos

reviews

articles

bookings

quiz questions

quiz options

recommendation rules

gift certificates

settings

Use secure access rules.

Public visitors must not have access to the admin area.

21. TECHNOLOGY

Preferred stack:

React

TypeScript

Tailwind CSS

Framer Motion

Supabase

Use clean reusable components.

Keep the architecture scalable.

22. IMPORTANT — NO FAKE FUNCTIONALITY

Do NOT create buttons that only look functional.

Important actions should actually work.

Examples:

booking button must open booking

portfolio upload must actually upload

admin editing must save changes

delete must delete

hide/show must work

quiz must calculate a recommendation

navigation must work

phone button must call

image/video upload must work

authentication must protect admin

If an external API is not connected yet, create a clear integration point instead of pretending that the function works.

23. CONTENT SAFETY / ACCURACY

Never invent business information.

Never create:

fake staff

fake reviews

fake prices

fake addresses

fake services

random portfolio images

Use placeholders only where information genuinely has not been provided.

The owner must be able to replace all placeholders from the admin panel.

24. FINAL IMPLEMENTATION REQUIREMENT

Build this as a real working web application for А&Астудия, not as a static design.

Start by creating:

project structure

responsive UI

Russian interface

Supabase database structure

authentication

admin panel

services management

portfolio/photo/video upload

hair test

booking flow

contacts

homepage

responsive mobile experience

All major functionality must be connected and testable.

The visual direction must remain:

Quiet Luxury + Powder Pink #F4D0D0 + milk/cream/beige/coffee/taupe/graphite + elegant typography + premium whitespace.

The final result should feel like a real premium beauty studio application, not a generic template.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://astudio-aura.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/8a4a41e3-ccc0-42bb-ab49-002a3677955f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
