import { useState, useEffect } from 'react'
import { Save, Eye, RotateCcw } from 'lucide-react'
import { getSettings, saveSettings } from '../../../lib/api'

const SETTING_KEY = 'privacy_policy_text'

const DEFAULT_POLICY = `سياسة الخصوصية — الثروة كابيتال

آخر تحديث: يونيو 2026

1. جمع المعلومات
نقوم بجمع المعلومات التي تقدمها لنا مباشرةً عند التسجيل أو استخدام خدماتنا، بما يشمل: الاسم، البريد الإلكتروني، رقم الهاتف، والبيانات المالية اللازمة لإدارة محفظتك الاستثمارية.

2. استخدام المعلومات
تُستخدم معلوماتك الشخصية لأغراض تشغيل الخدمة، التواصل معك، تحسين تجربة المستخدم، والامتثال للمتطلبات القانونية والتنظيمية.

3. حماية البيانات
نلتزم بأعلى معايير حماية البيانات. يتم تشفير جميع المعلومات الحساسة ولا يتم مشاركتها مع أطراف ثالثة دون موافقتك الصريحة، إلا في حالات يقتضيها القانون.

4. ملفات تعريف الارتباط (Cookies)
نستخدم ملفات تعريف الارتباط لتحسين تجربة التصفح وتذكر تفضيلاتك. يمكنك إيقاف تشغيلها من إعدادات المتصفح، لكن ذلك قد يؤثر على بعض وظائف الموقع.

5. حقوقك
يحق لك في أي وقت طلب الاطلاع على بياناتك، تصحيحها، أو حذفها. للتواصل: info@tharwahcapital.com

6. التعديلات
نحتفظ بحق تعديل هذه السياسة في أي وقت. سيتم إشعارك بأي تغييرات جوهرية عبر البريد الإلكتروني أو إشعار على المنصة.`

export default function PrivacyPolicyManager() {
  const [text, setText] = useState('')
  const [preview, setPreview] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSettings()
      .then(({ settings }) => {
        setText(settings[SETTING_KEY] || DEFAULT_POLICY)
      })
      .catch(() => {
        setText(DEFAULT_POLICY)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    try {
      await saveSettings({ [SETTING_KEY]: text })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch {
      alert('حدث خطأ أثناء الحفظ. تحقق من الاتصال.')
    }
  }

  const handleReset = () => {
    if (confirm('هل تريد إعادة تعيين النص للنسخة الافتراضية؟')) {
      setText(DEFAULT_POLICY)
    }
  }

  if (loading) return <div style={{padding:40,textAlign:'center',color:'#64748B'}}>جاري التحميل...</div>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>إدارة سياسة الخصوصية</h1>
          <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: 3 }}>
            النص الذي يظهر للزوار عند الضغط على "سياسة الخصوصية" في تذييل الموقع
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setPreview(p => !p)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', background: preview ? 'rgba(59,130,246,0.1)' : 'transparent', border: '1px solid #E2E8F0', borderRadius: 8, color: preview ? '#3B82F6' : '#64748B', cursor: 'pointer', fontFamily: "'Cairo',sans-serif", fontSize: '0.82rem', fontWeight: 600 }}
          >
            <Eye size={14} /> {preview ? 'تعديل' : 'معاينة'}
          </button>
          <button
            onClick={handleReset}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', background: 'transparent', border: '1px solid #E2E8F0', borderRadius: 8, color: '#94A3B8', cursor: 'pointer', fontFamily: "'Cairo',sans-serif", fontSize: '0.82rem' }}
          >
            <RotateCcw size={13} /> استعادة
          </button>
          <button
            onClick={handleSave}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: saved ? '#00D97E' : 'linear-gradient(135deg,#0EA5E9,#38BDF8)', border: 'none', borderRadius: 8, color: '#FFFFFF', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', fontFamily: "'Cairo',sans-serif", transition: 'background 0.3s' }}
          >
            <Save size={14} /> {saved ? '✅ تم الحفظ!' : 'حفظ التغييرات'}
          </button>
        </div>
      </div>

      <div style={{ background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.8rem', color: '#0369A1' }}>
        <span style={{ fontSize: '1rem', flexShrink: 0, marginTop: 1 }}>ℹ️</span>
        <span>
          التغييرات التي تحفظها هنا تظهر فوراً للزوار عند الضغط على رابط "سياسة الخصوصية" في تذييل الموقع. لا تحتاج إعادة تشغيل.
        </span>
      </div>

      {preview ? (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, padding: 32 }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1E293B', marginBottom: 20, paddingBottom: 12, borderBottom: '2px solid #E2E8F0' }}>
              سياسة الخصوصية
            </div>
            <div style={{ fontSize: '0.88rem', lineHeight: 2, color: '#475569', whiteSpace: 'pre-wrap' }}>
              {text}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', fontSize: '0.75rem', color: '#64748B' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F57', display: 'inline-block' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FEBC2E', display: 'inline-block' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28C840', display: 'inline-block' }} />
            <span style={{ marginRight: 8 }}>محرر سياسة الخصوصية</span>
          </div>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            dir="rtl"
            style={{
              width: '100%', minHeight: 520, padding: 24,
              background: '#FEFEFE', border: 'none', outline: 'none',
              fontSize: '0.88rem', lineHeight: 2, color: '#1E293B',
              fontFamily: "'Cairo',sans-serif", resize: 'vertical',
              boxSizing: 'border-box',
            }}
            placeholder="اكتب نص سياسة الخصوصية هنا..."
          />
          <div style={{ padding: '8px 16px', borderTop: '1px solid #E2E8F0', background: '#F8FAFC', display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94A3B8' }}>
            <span>{text.length} حرف</span>
            <span>{text.split('\n').length} سطر</span>
          </div>
        </div>
      )}
    </div>
  )
}
