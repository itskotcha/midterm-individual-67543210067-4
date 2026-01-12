# Library Management System

## 📋 Project Information
- **Student Name:** นางสาวกชพร วงศ์ใหญ่
- **Student ID:** 67543210067-4
- **Course:** ENGSE207 Software Architecture

## 📐 Architectural Overview
ระบบนี้พัฒนาโดยใช้สถาปัตยกรรมแบบ Layered Architecture (3-tier) เพื่อแก้ปัญหาโค้ดที่มีความซับซ้อนและรวมศูนย์อยู่ที่เดียว (Monolithic) โดยการแยกส่วนการทำงานออกเป็นชั้นชัดเจน เพื่อให้ง่ายต่อการบำรุงรักษาและการขยายระบบในอนาคต


## 📊 PART 1: C1 Context Diagram
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│                    System User                      │
│            (บรรณารักษ์ / ผู้ดูแลระบบ)                  │
│                                                     │
└────────────┬────────────────────────────────────────┘
             │
             │ HTTP Request (JSON)
             │ (Manage Books, Borrow, Return)
             │
             ▼
┌─────────────────────────────────────────────────────┐
│                                                     │
│       Library Management System                     │
│                                                     │
│  • จัดการข้อมูลหนังสือ (CRUD Operations)                │
│  • ระบบยืม-คืนหนังสือ (Borrow/Return Logic)            │
│  • ตรวจสอบความถูกต้องของ ISBN                         │
│  • รายงานสถิติจำนวนหนังสือตามสถานะ                      │
│                                                     │
└─────────────────────────────────────────────────────┘
```
---
## 🏗️ PART 2: C2 Container Diagram (3-Layers)
```
┌─────────────────────────────────────────────────────────────────┐
│              Presentation Layer (UI & Controllers)              │
│  • public/index.html (Frontend Interface)                       │
│  • src/presentation/routes/bookRoutes.js                        │
│  • src/presentation/controllers/bookController.js               │
└───────────────────────────────┬─────────────────────────────────┘
                                │ Calls
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│               Business Layer (Services & Logic)                 │
│  • src/business/services/bookService.js                         │
│  • src/business/validators/bookValidator.js                     │
└───────────────────────────────┬─────────────────────────────────┘
                                │ Calls
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│               Data Access Layer (Repositories)                  │
│  • src/data/repositories/bookRepository.js                      │
│  • src/data/database/connection.js (SQLite)                     │
└─────────────────────────────────────────────────────────────────┘
```
---
## 🧩 PART 3: Layer Responsibilities
### 1. **Presentation Layer (เลเยอร์การนำเสนอ)**
- Routes: กำหนดเส้นทางของ API ทั้งหมด เช่น /api/books

- Controllers: รับค่าจาก Request, ดึงข้อมูลจาก Parameter/Body, เรียกใช้ Service และส่ง Response กลับไปยัง Client พร้อม Status Code ที่ถูกต้อง

- ErrorHandler: Middleware สำหรับจัดการ Error ที่เกิดขึ้นในทุก Layer และตอบกลับเป็น JSON format

### 2. **Business Logic Layer (เลเยอร์ธุรกิจ)**
- Services: ประมวลผลกฎทางธุรกิจหลัก เช่น การตรวจสอบว่าหนังสือว่างหรือไม่ก่อนให้ยืม และการคำนวณสถิติสรุป (Available/Borrowed/Total)

- Validators: ตรวจสอบความถูกต้องของข้อมูลก่อนลง Database เช่น รูปแบบ ISBN (10 หรือ 13 หลัก) และตรวจสอบฟิลด์ที่จำเป็น

### 3. **Data Access Layer (เลเยอร์การจัดการข้อมูล)**
- Repositories: รวมคำสั่ง SQL (CRUD) ทั้งหมด เพื่อติดต่อกับฐานข้อมูล ลดการเขียน SQL ซ้ำซ้อนใน Layer อื่น

- Database Connection: จัดการการเชื่อมต่อกับ SQLite และการสร้างตาราง books เริ่มต้น

---
 ## 🔄 PART 4: Data Flow (Request -> Response)
ตัวอย่างขั้นตอนการทำงานเมื่อมีการ "ยืมหนังสือ" (Borrow):

**1.Client** ส่ง Request (PATCH) มายัง Routes

**2.Controller** รับ ID หนังสือและส่งต่อไปยัง Service

**3.Service** เรียกใช้ Validator เพื่อเช็คว่า ID ถูกต้องหรือไม่

**4.Service** เรียกใช้ Repository เพื่อตรวจสอบสถานะปัจจุบันของหนังสือจาก Database

**5.Repository** ส่งข้อมูลหนังสือกลับมา ถ้าสถานะคือ 'available' Service จะสั่งให้ Repository อัปเดตเป็น 'borrowed'

**6.Service** รับผลการอัปเดตและส่งกลับไปที่ Controller

**7.Controller** ส่ง JSON Response (สถานะหนังสือใหม่) กลับไปยัง Client เพื่ออัปเดตหน้าจอ UI
