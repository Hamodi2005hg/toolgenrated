import express from 'express';
import type { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

const DEFAULT_REPO_OWNER = 'Hamodi2005hg';
const DEFAULT_REPO_NAME = 'toolgenrated';

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API: Check GitHub Repository Status
app.get('/api/github/status', async (req: Request, res: Response) => {
  try {
    const token = (req.headers.authorization?.replace('Bearer ', '') || process.env.GITHUB_TOKEN || '').trim();
    const owner = (req.query.owner as string) || DEFAULT_REPO_OWNER;
    const repo = (req.query.repo as string) || DEFAULT_REPO_NAME;

    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github+json',
      'User-Agent': 'AIStudio-ToolGeneratorApp',
    };
    if (token) {
      headers['Authorization'] = `token ${token}`;
    }

    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
    if (!repoRes.ok) {
      const errData = await repoRes.json().catch(() => ({}));
      return res.status(repoRes.status).json({
        ok: false,
        error: errData.message || `GitHub API error: ${repoRes.statusText}`,
        owner,
        repo,
      });
    }

    const repoData = await repoRes.json();
    
    // Check commits
    const commitsRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits`, { headers });
    let commits: any[] = [];
    let isCatalogEmpty = false;
    if (commitsRes.ok) {
      commits = await commitsRes.json();
    } else {
      isCatalogEmpty = true;
    }

    return res.json({
      ok: true,
      owner,
      repo,
      fullName: repoData.full_name,
      description: repoData.description || 'مستودع أدوات الويب ومولد المقالات الذكي',
      isPrivate: repoData.private,
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      defaultBranch: repoData.default_branch || 'main',
      commitsCount: Array.isArray(commits) ? commits.length : 0,
      isEmpty: isCatalogEmpty || commits.length === 0,
      updatedAt: repoData.updated_at,
      htmlUrl: repoData.html_url,
    });
  } catch (error: any) {
    return res.status(500).json({ ok: false, error: error.message || 'Internal Server Error' });
  }
});

// API: Push application code to GitHub Repository
app.post('/api/github/push-code', async (req: Request, res: Response) => {
  try {
    const { token = process.env.GITHUB_TOKEN, message = 'تحديث شامل وإضافة أداة كتابة المقالات البشرية لـ SEO' } = req.body;
    const owner = DEFAULT_REPO_OWNER;
    const repo = DEFAULT_REPO_NAME;

    if (!token) {
      return res.status(400).json({ ok: false, error: 'رمز وصول جيت هاب (Token) مطلوب.' });
    }

    const cleanToken = String(token).trim();
    const repoUrlWithAuth = `https://${cleanToken}@github.com/${owner}/${repo}.git`;
    const tempDir = path.join('/tmp', `push_${Date.now()}`);

    fs.mkdirSync(tempDir, { recursive: true });

    const filesToInclude = [
      'index.html',
      'metadata.json',
      'package.json',
      'tsconfig.json',
      'vite.config.ts',
      'server.ts',
      '.gitignore',
      'src',
    ];

    for (const item of filesToInclude) {
      const srcPath = path.join(process.cwd(), item);
      const destPath = path.join(tempDir, item);
      if (fs.existsSync(srcPath)) {
        fs.cpSync(srcPath, destPath, { recursive: true });
      }
    }

    const commands = [
      'git init',
      'git config user.name "Hamodi AI Builder"',
      'git config user.email "hamodi20052@gmail.com"',
      'git checkout -b main',
      'git add .',
      `git commit -m "${message.replace(/"/g, '\\"')}"`,
      `git push -f ${repoUrlWithAuth} main`,
    ].join(' && ');

    const { stdout, stderr } = await execAsync(commands, { cwd: tempDir });

    fs.rmSync(tempDir, { recursive: true, force: true });

    return res.json({
      ok: true,
      message: 'تم رفع كافة ملفات المشروع والتعديلات إلى مستودع GitHub بنجاح!',
      repoUrl: `https://github.com/${owner}/${repo}`,
      details: stdout || stderr,
    });
  } catch (error: any) {
    return res.status(500).json({
      ok: false,
      error: error.message || 'فشلت عملية الرفع إلى GitHub.',
    });
  }
});

// Dedicated API: Advanced SEO Humanized Article Generator
app.post('/api/ai/generate-article', async (req: Request, res: Response) => {
  try {
    const {
      topic,
      language = 'العربية',
      wordCountLength = 'متوسط (800 - 1200 كلمة)',
      headings = '',
      keywords = '',
      tone = 'بشري احترافي وسلس (SEO-Optimized)',
    } = req.body;

    if (!topic) {
      return res.status(400).json({ ok: false, error: 'عنوان موضوع المقال مطلوب.' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(500).json({
        ok: false,
        error: 'لم يتم العثور على مفتاح GEMINI_API_KEY. يرجى إضافته في إعدادات الأسرار (Secrets).',
      });
    }

    const articlePrompt = `
تصرف كخبير سيو (SEO) ومدون بشري محترف لديه 10 سنوات من الخبرة في كتابة المقالات الحصرية لغوغل أدسنس. 
أريدك أن تكتب لي مقالاً احترافياً وحصرياً بلغة: ${language} حول موضوع: "${topic}".

إرشادات العناوين المستهدفة (إن وجدت): ${headings || 'اختر عناوين فرعية H2 و H3 جذابة ومطابقة لنوايا البحث (Search Intent)'}
الكلمات المفتاحية المستهدفة للـ SEO: ${keywords || 'استخرج أفضل الكلمات المفتاحية وتداخلها بسلاسة'}
الحجم المستهدف للمقال: ${wordCountLength}
نبرة الكتابة: ${tone}

أثناء الكتابة، التزم بدقة بالقواعد البشرية التالية لكسر النمطية الآلية:
1. تنوع طول الجمل (Burstiness): لا تكتب بجمل متساوية الطول. استخدم جملة قصيرة جداً تليها جملة متوسطة ثم جملة طويلة. هذا التباين هو أساس الكتابة البشرية العفوية.
2. الأسلوب اللغوي (Perplexity): ابتعد تماماً عن الكلمات النمطية للذكاء الاصطناعي مثل (في هذا العصر الرقمي، في الآونة الأخيرة، تجدر الإشارة، مما لا شك فيه، علاوة على ذلك). استبدلها بعبارات بشرية سلسة مثل (بصراحة، لنتفق أولاً، في الواقع، من واقع التجربة، ببساطة).
3. الهيكلة والتنسيق: قسّم المقال إلى مقدمة مشوقة، ثم عناوين فرعية (H2, H3)، واستخدم القوائم النقطية (Bullet Points) أو الجداول لتلخيص المعلومات كلما أمكن ذلك لسهولة القراءة.
4. القيمة والمثالية (Helpful Content): لا تعتمد على الحشو العام. اذكر أمثلة عملية واقعية واقترح حلولاً حقيقية للمشكلة التي يناقشها المقال.
5. الأخطاء العفوية والخاتمة: اكتب بأسلوب مرن وتجنب التقعر اللغوي المبالغ فيه، واجعل الخاتمة عبارة عن نصيحة ودية للقارئ وسؤال تفاعلي وليس تلخيصاً مملاً للمقال.
6. أماكن الصور التوضيحية (مهم جداً): أثناء تدفق المقال، قم بترك مساحات فارغة مخصصة للصور (3 صور على الأقل موزعة بين الفقرات). ضع مكانها علامة واضحة مثل:
[مكان الصورة الأولى هنا: وصف قصير لفكرة الصورة بالعربية + English search keywords]
[مكان الصورة الثانية هنا: وصف قصير لفكرة الصورة بالعربية + English search keywords]
[مكان الصورة الثالثة هنا: وصف قصير لفكرة الصورة بالعربية + English search keywords]

قم بإرجاع النتيجة بتنسيق JSON يحتوي على:
- title: العنوان المقترح والمنسق للمقال
- metaDescription: وصف ميتا SEO قصير وجذاب (حوالي 150-160 حرف)
- keywordsList: قائمة الكلمات المفتاحية المستخرجة
- articleContent: المقال المكتوب بالكامل بأسلوب Markdown غني (يحتوي H2, H3, Bullet points, الجداول، ومواضع الصور الواضحة).
- imageSuggestions: مصفوفة بأسماء ومواضع الصور الثلاث الموصى بها مع الكلمات المفتاحية بالإنجليزية.
- estimatedReadTime: وقت القراءة التقريبي (مثلاً: 5 دقائق)
- seoScore: تقييم سيو من 100 (مثلاً: 98/100)
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: articlePrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            metaDescription: { type: Type.STRING },
            keywordsList: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            articleContent: { type: Type.STRING },
            imageSuggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  arabicDescription: { type: Type.STRING },
                  englishSearchQuery: { type: Type.STRING },
                },
              },
            },
            estimatedReadTime: { type: Type.STRING },
            seoScore: { type: Type.NUMBER },
          },
        },
      },
    });

    const text = response.text || '{}';
    const result = JSON.parse(text);

    return res.json({
      ok: true,
      article: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      ok: false,
      error: error.message || 'فشل توليد المقال الذكي عبر Gemini API',
    });
  }
});

// Generic AI Tool Generator
app.post('/api/ai/generate-tool', async (req: Request, res: Response) => {
  try {
    const { prompt, category = 'General' } = req.body;

    if (!prompt) {
      return res.status(400).json({ ok: false, error: 'الرجاء إدخال وصف الأداة المطلوبة.' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(500).json({
        ok: false,
        error: 'لم يتم العثور على مفتاح GEMINI_API_KEY. يرجى إضافته في إعدادات الأسرار (Secrets).',
      });
    }

    const systemInstruction = `
أنت مهندس برمجيات متخصص في بناء وتوليد أدوات ويب تفاعلية وخدمات صغيرة (Web Utilities & Developer Micro-Tools).
عندما يطلب منك المستخدم بناء أداة معينة، قم بتوليد كود وشكل ودوال هذه الأداة بشكل دقيق وبنية برمجية ممتازة باللغة العربية والإنجليزية.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `قم بتوليد أداة تفاعلية بناءً على الطلب التالي: "${prompt}". التصنيف المقترح: ${category}.`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            titleEn: { type: Type.STRING },
            description: { type: Type.STRING },
            category: { type: Type.STRING },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            inputs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  label: { type: Type.STRING },
                  type: { type: Type.STRING },
                  placeholder: { type: Type.STRING },
                  defaultValue: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
              },
            },
            outputs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  label: { type: Type.STRING },
                  type: { type: Type.STRING },
                  language: { type: Type.STRING },
                },
              },
            },
            jsLogic: { type: Type.STRING },
            usageInstructions: { type: Type.STRING },
            examplePrompt: { type: Type.STRING },
          },
        },
      },
    });

    const text = response.text || '{}';
    const toolData = JSON.parse(text);

    return res.json({
      ok: true,
      tool: toolData,
    });
  } catch (error: any) {
    return res.status(500).json({
      ok: false,
      error: error.message || 'فشل توليد الأداة عبر ذكاء جميناي',
    });
  }
});

// Vite middleware in dev or static files in prod
async function startServer() {
  const PORT = Number(process.env.PORT) || 3000;

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
