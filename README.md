# NUS-UniWash

A mobile booking system for NUS washing machines powered by React Native and Appwrite.

---

## 🚀 Installation

### 1. Clone the repository
```bash
git clone https://github.com/Khantminn290/NUS-UniWash.git
cd NUS-UniWash
```

---

## 🧠 Backend Setup (Appwrite)

### 2. Set up Appwrite
- Go to [https://appwrite.io](https://appwrite.io) and log in or self-host Appwrite.
- Create a new **project**.
- Enable **Email/Password** auth in **Authentication > Auth Methods**.
- Create a **Database**, e.g., `wash-machines`, and set up your required collections.
- Go to **API keys** and create one if needed.

---

### 3. Create a `.env` file in the root directory
Add the following variables:
```
APPWRITE_ENDPOINT=https://your-appwrite-url/v1
APPWRITE_PROJECT_ID=your-project-id
APPWRITE_PLATFORM=your-platform-id
APPWRITE_API_KEY=your-api-key
```

---

## 💻 Frontend Setup (React Native)

### 4. Install frontend dependencies
```bash
npm install
```

or if you're using yarn:

```bash
yarn install
```

---

### 5. Run the app
```bash
npx expo start
```

Open the Expo Go app on your phone or run on a simulator.

---

## 🔌 Backend Services

Appwrite handles:
- User authentication
- Database (machine bookings, user info)
- Functions (optional — e.g., email reminders)

---

## 📱 APIs

You can find the full API reference at:
[https://appwrite.io/docs](https://appwrite.io/docs)

---

## 🛠️ Tech Stack

- ⚛️ React Native (via Expo)
- 🧠 Appwrite (backend)
- 📦 Appwrite SDK
