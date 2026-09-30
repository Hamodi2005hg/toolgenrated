import { CustomTool } from '../types';

export const DEFAULT_TOOLS: CustomTool[] = [
  {
    id: 'json-formatter',
    title: 'منسق وفاحص JSON (JSON Formatter)',
    titleEn: 'JSON Formatter & Validator',
    description: 'قم بتنسيق أكواد JSON أو ضغطها أو التحقق من صحة القواعد البرمجية واكتشاف الأخطاء فورياً.',
    category: 'برمجة وتطوير',
    tags: ['JSON', 'Formatter', 'Validator', 'Developer'],
    inputs: [
      {
        id: 'rawJson',
        label: 'نص JSON الخام',
        type: 'textarea',
        placeholder: '{"name": "ToolGen", "version": 1}',
        defaultValue: '{\n  "appName": "Tool Generator",\n  "github": "Hamodi2005hg/toolgenrated",\n  "status": "active",\n  "features": ["AI Generation", "GitHub Sync", "20+ Builtin Tools"],\n  "version": 2.0\n}',
      },
      {
        id: 'mode',
        label: 'وضع المعالجة',
        type: 'select',
        options: ['تنسيق مريح (2 مسافات)', 'تنسيق مريح (4 مسافات)', 'ضغط (Minify)'],
        defaultValue: 'تنسيق مريح (2 مسافات)',
      },
    ],
    outputs: [
      { id: 'result', label: 'النتيجة المنسقة', type: 'code', language: 'json' },
      { id: 'status', label: 'حالة الفحص', type: 'text' },
    ],
    jsLogic: `
      try {
        const obj = JSON.parse(inputs.rawJson);
        let indent = 2;
        if (inputs.mode.includes('4')) indent = 4;
        if (inputs.mode.includes('ضغط')) indent = 0;
        
        const formatted = indent > 0 ? JSON.stringify(obj, null, indent) : JSON.stringify(obj);
        const keysCount = Object.keys(obj).length;
        
        return {
          result: formatted,
          status: "✅ الكود صحيح ومعالج بنجاح (" + keysCount + " عناصر مفتاحية)"
        };
      } catch (e) {
        return {
          result: "خطأ في بنية JSON:\n" + e.message,
          status: "❌ غير صالح: " + e.message
        };
      }
    `,
    usageInstructions: 'أدخل نص JSON في المربع العلوي واختر نوع التنسيق ليتم تحديث النتيجة تلقائياً.',
  },
  {
    id: 'password-generator',
    title: 'مولد ومقيم أمان كلمات المرور',
    titleEn: 'Secure Password Generator & Strength Meter',
    description: 'توليد كلمات سر معقدة وغير قابلة للاختراق مع إمكانية تخصيص الطول والرموز والتحقق من القوة.',
    category: 'حماية وتشفير',
    tags: ['Password', 'Security', 'Crypto', 'Generator'],
    inputs: [
      {
        id: 'length',
        label: 'طول كلمة المرور (8 - 64)',
        type: 'range',
        defaultValue: '16',
        min: 8,
        max: 64,
        step: 1,
      },
      {
        id: 'useUppercase',
        label: 'تضمين أحرف كبيرة (A-Z)',
        type: 'checkbox',
        defaultValue: 'true',
      },
      {
        id: 'useNumbers',
        label: 'تضمين أرقام (0-9)',
        type: 'checkbox',
        defaultValue: 'true',
      },
      {
        id: 'useSymbols',
        label: 'تضمين رموز خاصة (!@#$%^&*)',
        type: 'checkbox',
        defaultValue: 'true',
      },
    ],
    outputs: [
      { id: 'password', label: 'كلمة المرور الناتجة', type: 'code', language: 'text' },
      { id: 'strength', label: 'تقييم القوة', type: 'text' },
      { id: 'entropy', label: 'نسبة التعقيد (Entropy)', type: 'text' },
    ],
    jsLogic: `
      const length = parseInt(inputs.length) || 16;
      let chars = 'abcdefghijklmnopqrstuvwxyz';
      if (inputs.useUppercase === 'true' || inputs.useUppercase === true) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (inputs.useNumbers === 'true' || inputs.useNumbers === true) chars += '0123456789';
      if (inputs.useSymbols === 'true' || inputs.useSymbols === true) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

      let pass = '';
      for (let i = 0; i < length; i++) {
        pass += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      let strengthText = 'متوسطة 🟡';
      if (length >= 14 && chars.length > 60) strengthText = 'قوية جداً وممتازة 🟢 (درع حصين)';
      else if (length >= 10 && chars.length > 30) strengthText = 'جيدة وقوية 🟢';
      else if (length < 10) strengthText = 'ضعيفة 🔴 (ينصح بزيادة الطول)';

      const entropy = Math.round(length * Math.log2(chars.length));

      return {
        password: pass,
        strength: strengthText,
        entropy: entropy + " bits"
      };
    `,
    usageInstructions: 'اختر طول كلمة السر والخيارات المرغوبة للحصول على كلمة سر فائقة الأمان.',
  },
  {
    id: 'color-converter',
    title: 'محول الألوان وتوليد التدرجات (Color & Palette)',
    titleEn: 'HEX, RGB, HSL Color Converter & Palette',
    description: 'تحويل صيغ الألوان بين HEX و RGB و HSL واكتشاف الدرجات المكملة والتدرجات الجمالية.',
    category: 'ألوان وتصميم',
    tags: ['Color', 'Design', 'Palette', 'CSS', 'Hex'],
    inputs: [
      {
        id: 'colorHex',
        label: 'اختر أو أدخل لون (Hex)',
        type: 'color',
        defaultValue: '#6366f1',
      },
    ],
    outputs: [
      { id: 'hex', label: 'صيغة HEX', type: 'text' },
      { id: 'rgb', label: 'صيغة RGB', type: 'text' },
      { id: 'hsl', label: 'صيغة HSL', type: 'text' },
      { id: 'cssGradient', label: 'تدرج CSS الجاهز', type: 'code', language: 'css' },
    ],
    jsLogic: `
      const hex = inputs.colorHex || '#6366f1';
      let cleanHex = hex.replace('#', '');
      if (cleanHex.length === 3) cleanHex = cleanHex.split('').map(c => c+c).join('');
      
      const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
      const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
      const b = parseInt(cleanHex.substring(4, 6), 16) || 0;

      const rgbStr = 'rgb(' + r + ', ' + g + ', ' + b + ')';

      // RGB to HSL
      const rf = r / 255, gf = g / 255, bf = b / 255;
      const max = Math.max(rf, gf, bf), min = Math.min(rf, gf, bf);
      let h = 0, s = 0, l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case rf: h = (gf - bf) / d + (gf < bf ? 6 : 0); break;
          case gf: h = (bf - rf) / d + 2; break;
          case bf: h = (rf - gf) / d + 4; break;
        }
        h /= 6;
      }

      const hslStr = 'hsl(' + Math.round(h * 360) + ', ' + Math.round(s * 100) + '%, ' + Math.round(l * 100) + '%)';
      const gradient = 'background: linear-gradient(135deg, ' + hex + ' 0%, #1e1b4b 100%);';

      return {
        hex: hex.toUpperCase(),
        rgb: rgbStr,
        hsl: hslStr,
        cssGradient: gradient
      };
    `,
  },
  {
    id: 'vat-calculator',
    title: 'حاسبة النسبة المئوية وضريبة القيمة المضافة (VAT Calculator)',
    titleEn: 'VAT & Percentage Financial Calculator',
    description: 'حساب ضريبة القيمة المضافة وإضافة أو خصم النسبة المئوية من المبالغ المالية بسرعة ودقة.',
    category: 'رياضيات وحساب',
    tags: ['VAT', 'Finance', 'Tax', 'Calculator', 'Math'],
    inputs: [
      {
        id: 'amount',
        label: 'المبلغ الأساسي (ر.س / $)',
        type: 'number',
        defaultValue: '1000',
      },
      {
        id: 'vatRate',
        label: 'نسبة الضريبة %',
        type: 'select',
        options: ['15%', '5%', '10%', '20%'],
        defaultValue: '15%',
      },
      {
        id: 'calcType',
        label: 'طريقة الحساب',
        type: 'select',
        options: ['المبلغ قبل الضريبة (إضافة الضريبة)', 'المبلغ شامل الضريبة (استخراج الضريبة)'],
        defaultValue: 'المبلغ قبل الضريبة (إضافة الضريبة)',
      },
    ],
    outputs: [
      { id: 'baseAmount', label: 'المبلغ الأساسي قبل الضريبة', type: 'text' },
      { id: 'vatAmount', label: 'قيمة الضريبة فقط', type: 'text' },
      { id: 'totalAmount', label: 'المبلغ الإجمالي النهائي', type: 'text' },
    ],
    jsLogic: `
      const amount = parseFloat(inputs.amount) || 0;
      const rateNum = parseFloat(inputs.vatRate.replace('%', '')) || 15;
      const rate = rateNum / 100;

      let base = 0;
      let vat = 0;
      let total = 0;

      if (inputs.calcType.includes('قبل الضريبة')) {
        base = amount;
        vat = amount * rate;
        total = base + vat;
      } else {
        total = amount;
        base = total / (1 + rate);
        vat = total - base;
      }

      return {
        baseAmount: base.toFixed(2) + ' ر.س',
        vatAmount: vat.toFixed(2) + ' ر.س (' + rateNum + '%)',
        totalAmount: total.toFixed(2) + ' ر.س'
      };
    `,
  },
  {
    id: 'base64-hash-tool',
    title: 'محول التشفير Base64 و URL Encoding',
    titleEn: 'Base64 & URL Encoder/Decoder',
    description: 'تشفير وفك تشفير النصوص والأكواد باستخدام Base64 و URL Component.',
    category: 'حماية وتشفير',
    tags: ['Base64', 'Crypto', 'URL', 'Encode', 'Decode'],
    inputs: [
      {
        id: 'text',
        label: 'النص المراد معالجته',
        type: 'textarea',
        placeholder: 'أدخل النص هنا...',
        defaultValue: 'Tool Generator for Hamodi2005hg/toolgenrated',
      },
      {
        id: 'action',
        label: 'نوع العملية',
        type: 'select',
        options: ['Base64 Encode (تشفير)', 'Base64 Decode (فك التشفير)', 'URL Encode (تشفير الرابط)', 'URL Decode (فك تشفير الرابط)'],
        defaultValue: 'Base64 Encode (تشفير)',
      },
    ],
    outputs: [
      { id: 'output', label: 'النتيجة', type: 'code', language: 'text' },
    ],
    jsLogic: `
      const text = inputs.text || '';
      const action = inputs.action || '';

      try {
        if (action.includes('Base64 Encode')) {
          return { output: btoa(unescape(encodeURIComponent(text))) };
        } else if (action.includes('Base64 Decode')) {
          return { output: decodeURIComponent(escape(atob(text))) };
        } else if (action.includes('URL Encode')) {
          return { output: encodeURIComponent(text) };
        } else if (action.includes('URL Decode')) {
          return { output: decodeURIComponent(text) };
        }
        return { output: text };
      } catch (e) {
        return { output: 'خطأ أثناء المعالجة: ' + e.message };
      }
    `,
  },
  {
    id: 'text-analyzer',
    title: 'محلل النص ومعداد الكلمات والرموز',
    titleEn: 'Text Analyzer & Character Counter',
    description: 'تحليل دقيق للنصوص، حساب الكلمات والجمل، تقدير وقت القراءة وتغيير حالة الأحرف.',
    category: 'نصوص وتحويلات',
    tags: ['Text', 'Counter', 'Words', 'Analytics'],
    inputs: [
      {
        id: 'content',
        label: 'النص المراد تحليله',
        type: 'textarea',
        placeholder: 'ضع نصك هنا...',
        defaultValue: 'مرحباً بك في تطبيق Tool Generator! تطبيق متكامل لتوليد وتشغيل وإدارة أدوات الويب الذكية والمتصل بمستودع الجيتهاب.',
      },
    ],
    outputs: [
      { id: 'charCount', label: 'عدد الأحرف الإجمالي', type: 'text' },
      { id: 'charNoSpaces', label: 'عدد الأحرف بدون مسافات', type: 'text' },
      { id: 'wordCount', label: 'عدد الكلمات', type: 'text' },
      { id: 'sentenceCount', label: 'عدد الجمل', type: 'text' },
      { id: 'readTime', label: 'وقت القراءة المتوقع', type: 'text' },
      { id: 'uppercase', label: 'النص بأحرف كبيرة (Upper)', type: 'code', language: 'text' },
    ],
    jsLogic: `
      const txt = inputs.content || '';
      const chars = txt.length;
      const charsNoSpace = txt.replace(/\\s+/g, '').length;
      const words = txt.trim() ? txt.trim().split(/\\s+/).length : 0;
      const sentences = txt.trim() ? txt.split(/[.!?\n]+/).filter(Boolean).length : 0;
      const readingMinutes = Math.ceil(words / 180);

      return {
        charCount: chars + ' حرف',
        charNoSpaces: charsNoSpace + ' حرف',
        wordCount: words + ' كلمة',
        sentenceCount: sentences + ' جملة',
        readTime: readingMinutes <= 1 ? 'أقل من دقيقة' : readingMinutes + ' دقائق',
        uppercase: txt.toUpperCase()
      };
    `,
  },
  {
    id: 'uuid-generator',
    title: 'مولد المعرفات الفريدة (UUID v4 Generator)',
    titleEn: 'UUID / GUID v4 Batch Generator',
    description: 'توليد أرقام ومعرفات فريدة عشوائية لاستخدامها في قواعد البيانات والنظم البرمجية.',
    category: 'برمجة وتطوير',
    tags: ['UUID', 'GUID', 'Database', 'ID', 'Developer'],
    inputs: [
      {
        id: 'count',
        label: 'عدد المعرفات المطلوبة (1 - 50)',
        type: 'range',
        defaultValue: '5',
        min: 1,
        max: 50,
        step: 1,
      },
      {
        id: 'uppercase',
        label: 'أحرف كبيرة (UPPERCASE)',
        type: 'checkbox',
        defaultValue: 'false',
      },
    ],
    outputs: [
      { id: 'uuids', label: 'قائمة المعرفات الناتجة', type: 'code', language: 'text' },
    ],
    jsLogic: `
      const count = parseInt(inputs.count) || 5;
      const isUpper = inputs.uppercase === 'true' || inputs.uppercase === true;
      
      const uuids = [];
      for (let i = 0; i < count; i++) {
        let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
        if (isUpper) uuid = uuid.toUpperCase();
        uuids.push(uuid);
      }

      return {
        uuids: uuids.join('\\n')
      };
    `,
  },
  {
    id: 'unit-converter',
    title: 'محول الوحدات الذكي (Unit Converter)',
    titleEn: 'Universal Measurement Unit Converter',
    description: 'تحويل وحدات قياس الحرارة والوزن والمسافة وحجم البيانات الرقمية بنقرة واحدة.',
    category: 'رياضيات وحساب',
    tags: ['Unit', 'Converter', 'Physics', 'Storage', 'Math'],
    inputs: [
      {
        id: 'val',
        label: 'القيمة',
        type: 'number',
        defaultValue: '100',
      },
      {
        id: 'type',
        label: 'نوع التحويل',
        type: 'select',
        options: [
          'درجة حرارة: مؤوي (°C) ⇄ فهرنهايت (°F)',
          'مسافة: كيلومتر ⇄ ميل',
          'وزن: كيلوجرام ⇄ باوند (رطل)',
          'بيانات: ميجابايت (MB) ⇄ جيجابايت (GB)'
        ],
        defaultValue: 'درجة حرارة: مؤوي (°C) ⇄ فهرنهايت (°F)',
      },
    ],
    outputs: [
      { id: 'forward', label: 'التحويل المباشر', type: 'text' },
      { id: 'reverse', label: 'التحويل العكسي', type: 'text' },
    ],
    jsLogic: `
      const v = parseFloat(inputs.val) || 0;
      const type = inputs.type || '';

      if (type.includes('درجة حرارة')) {
        const f = (v * 9/5) + 32;
        const c = (v - 32) * 5/9;
        return {
          forward: v + ' °C = ' + f.toFixed(2) + ' °F',
          reverse: v + ' °F = ' + c.toFixed(2) + ' °C'
        };
      } else if (type.includes('مسافة')) {
        const miles = v * 0.621371;
        const km = v / 0.621371;
        return {
          forward: v + ' كم = ' + miles.toFixed(2) + ' ميل',
          reverse: v + ' ميل = ' + km.toFixed(2) + ' كم'
        };
      } else if (type.includes('وزن')) {
        const lbs = v * 2.20462;
        const kg = v / 2.20462;
        return {
          forward: v + ' كجم = ' + lbs.toFixed(2) + ' باوند',
          reverse: v + ' باوند = ' + kg.toFixed(2) + ' كجم'
        };
      } else if (type.includes('بيانات')) {
        const gb = v / 1024;
        const mb = v * 1024;
        return {
          forward: v + ' MB = ' + gb.toFixed(4) + ' GB',
          reverse: v + ' GB = ' + mb.toLocaleString() + ' MB'
        };
      }
      return { forward: '-', reverse: '-' };
    `,
  },
];
