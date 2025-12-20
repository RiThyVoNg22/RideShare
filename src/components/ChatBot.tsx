import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User as UserIcon, HelpCircle, Sparkles, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Link, useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  suggestions?: string[];
  action?: {
    type: 'link' | 'button';
    label: string;
    url?: string;
  };
}

const ChatBot: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationContext, setConversationContext] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial greeting with suggestions
      const greeting = language === 'km' 
        ? 'សួស្តី! 👋 ខ្ញុំជា AI Assistant របស់ RideShare Local។ តើខ្ញុំអាចជួយអ្នកដោយរបៀបណា?'
        : 'Hello! 👋 I\'m RideShare Local\'s AI Assistant. How can I help you today?';
      
      const suggestions = language === 'km'
        ? ['របៀបផ្ទៀងផ្ទាត់ ID', 'របៀបជួលយានយន្ត', 'របៀបលក់យានយន្ត', 'តម្លៃបង់ប្រាក់']
        : ['How to verify ID?', 'How to rent a vehicle?', 'How to list my vehicle?', 'Payment methods'];
      
      setMessages([{
        id: '1',
        text: greeting,
        sender: 'bot',
        timestamp: new Date(),
        suggestions
      }]);
    }
  }, [isOpen, language]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const faqData = [
    {
      keywords: ['verify', 'verification', 'id', 'identity', 'ផ្ទៀងផ្ទាត់', 'អត្តសញ្ញាណ'],
      response: language === 'km'
        ? 'ដើម្បីផ្ទៀងផ្ទាត់អត្តសញ្ញាណរបស់អ្នក:\n\n1️⃣ ទៅទំព័រ Profile របស់អ្នក\n2️⃣ ចុចលើ "Verify ID" ឬទៅកាន់ /verify-id\n3️⃣ អាប់ឡូតរូបភាព ID របស់អ្នក (National ID, Passport, ឬ Driver\'s License)\n4️⃣ យើងនឹងពិនិត្យក្នុងរយៈពេល 24-48 ម៉ោង\n\n✅ ការផ្ទៀងផ្ទាត់អត្តសញ្ញាណគឺចាំបាច់សម្រាប់សុវត្ថិភាពរបស់អ្នកប្រើប្រាស់ទាំងអស់។'
        : 'To verify your identity:\n\n1️⃣ Go to your Profile page\n2️⃣ Click "Verify ID" or visit /verify-id\n3️⃣ Upload your ID photo (National ID, Passport, or Driver\'s License)\n4️⃣ We\'ll review it within 24-48 hours\n\n✅ ID verification is required for the safety of all users.',
      action: {
        type: 'link',
        label: language === 'km' ? 'ទៅផ្ទៀងផ្ទាត់ ID' : 'Go to Verify ID',
        url: '/verify-id'
      },
      suggestions: language === 'km' 
        ? ['តើផ្ទៀងផ្ទាត់យូរប៉ុណ្ណា?', 'តើត្រូវការ ID អ្វី?', 'របៀបផ្ទៀងផ្ទាត់']
        : ['How long does verification take?', 'What ID do I need?', 'Why verify?']
    },
    {
      keywords: ['payment', 'pay', 'money', 'បង់ប្រាក់', 'card', 'credit', 'debit', 'aba', 'wing'],
      response: language === 'km'
        ? '💳 វិធីបង់ប្រាក់ដែលយើងទទួលយក:\n\n✅ ABA Pay\n✅ Wing\n✅ Pi Pay\n✅ កាតឥណទាន/ប្រាក់កក់ (Visa, Mastercard)\n\n🔒 ការទូទាត់ទាំងអស់ត្រូវបានដំណើរការដោយសុវត្ថិភាព និងត្រូវបានការពារដោយ encryption។\n\n💰 អ្នកនឹងត្រូវបង់:\n• តម្លៃជួល (daily rate × days)\n• Service fee (5%)\n• Security deposit (ត្រូវបានបង្វិលវិញបន្ទាប់ពីជួល)'
        : '💳 Payment methods we accept:\n\n✅ ABA Pay\n✅ Wing\n✅ Pi Pay\n✅ Credit/Debit Cards (Visa, Mastercard)\n\n🔒 All payments are processed securely with encryption protection.\n\n💰 You\'ll pay:\n• Rental fee (daily rate × days)\n• Service fee (5%)\n• Security deposit (refunded after rental)',
      suggestions: language === 'km'
        ? ['តើ deposit ត្រូវបង្វិលវិញពេលណា?', 'តើ service fee ជាអ្វី?']
        : ['When is deposit refunded?', 'What is service fee?']
    },
    {
      keywords: ['cancel', 'cancellation', 'បោះបង់', 'refund'],
      response: language === 'km'
        ? '🔄 គោលការណ៍បោះបង់:\n\n✅ បោះបង់ឥតគិតថ្លៃ: រហូតដល់ 24 ម៉ោងមុនពេល pickup\n⚠️ បោះបង់ក្នុង 24 ម៉ោង: 50% refund\n❌ បោះបង់ក្រោយ pickup: គ្មាន refund\n\n📝 ដើម្បីបោះបង់:\n1. ទៅ Profile → My Bookings\n2. ចុចលើ booking ដែលអ្នកចង់បោះបង់\n3. ចុច "Cancel"\n\n💡 ការបោះបង់ត្រូវបានដំណើរការទៅកាន់គណនីដើមរបស់អ្នកក្នុង 3-5 ថ្ងៃ។'
        : '🔄 Cancellation Policy:\n\n✅ Free cancellation: Up to 24 hours before pickup\n⚠️ Cancel within 24 hours: 50% refund\n❌ Cancel after pickup: No refund\n\n📝 To cancel:\n1. Go to Profile → My Bookings\n2. Click on the booking you want to cancel\n3. Click "Cancel"\n\n💡 Refunds are processed to your original payment method within 3-5 business days.',
      suggestions: language === 'km'
        ? ['តើ refund យូរប៉ុណ្ណា?', 'តើអាចបោះបង់បន្ទាប់ពី pickup?']
        : ['How long for refund?', 'Can I cancel after pickup?']
    },
    {
      keywords: ['rent', 'renting', 'book', 'booking', 'ជួល', 'how to rent', 'របៀបជួល'],
      response: language === 'km'
        ? '🚗 របៀបជួលយានយន្ត:\n\n1️⃣ ទៅទំព័រ "Rent" ឬ "/rent"\n2️⃣ រកមើលយានយន្តដែលអ្នកចង់ជួល (ប្រើ filter ដើម្បីស្វែងរកតាមទីតាំង, តម្លៃ, ប្រភេទ)\n3️⃣ ចុចលើយានយន្តដើម្បីមើលព័ត៌មានលម្អិត\n4️⃣ ជ្រើសរើស pickup date និង return date\n5️⃣ ពិនិត្យតម្លៃ និងចុច "Book Now"\n6️⃣ បង់ប្រាក់ដើម្បីបញ្ជាក់ការកក់\n\n✅ ក្រោយពីកក់ អ្នកនឹងទទួលបាន confirmation email និងអាចទាក់ទងម្ចាស់យានយន្តតាមរយៈ chat។'
        : '🚗 How to rent a vehicle:\n\n1️⃣ Go to "Rent" page or "/rent"\n2️⃣ Browse available vehicles (use filters for location, price, type)\n3️⃣ Click on a vehicle to see details\n4️⃣ Select pickup and return dates\n5️⃣ Review pricing and click "Book Now"\n6️⃣ Make payment to confirm booking\n\n✅ After booking, you\'ll receive a confirmation email and can contact the owner via chat.',
      action: {
        type: 'link',
        label: language === 'km' ? 'ទៅទំព័រ Rent' : 'Go to Rent Page',
        url: '/rent'
      },
      suggestions: language === 'km'
        ? ['តើត្រូវការ verify ID មុនជួល?', 'តើតម្លៃប៉ុណ្ណា?']
        : ['Do I need to verify ID first?', 'How much does it cost?']
    },
    {
      keywords: ['list', 'owner', 'earn', 'money', 'លក់', 'how to list', 'របៀបលក់'],
      response: language === 'km'
        ? '💰 របៀបលក់យានយន្ត:\n\n1️⃣ ទៅទំព័រ "List Your Vehicle" ឬ "/list-vehicle"\n2️⃣ បំពេញព័ត៌មានយានយន្ត:\n   • ឈ្មោះ, ប្រភេទ, brand, model\n   • តម្លៃក្នុងមួយថ្ងៃ\n   • ទីតាំង\n   • រូបភាព (យ៉ាងហោចណាស់ 3-5 រូប)\n3️⃣ បញ្ជាក់ availability\n4️⃣ Submit និងរង់ចាំ approval\n\n💵 ប្រាក់ចំណូលប៉ាន់ស្មាន:\n• រថយន្ត: $25-50/ថ្ងៃ\n• Motorbike: $6-12/ថ្ងៃ\n• Bicycle: $3-8/ថ្ងៃ\n\n✅ យើងយក commission 10% ពីការជួល។'
        : '💰 How to list your vehicle:\n\n1️⃣ Go to "List Your Vehicle" page or "/list-vehicle"\n2️⃣ Fill in vehicle information:\n   • Name, type, brand, model\n   • Price per day\n   • Location\n   • Photos (at least 3-5)\n3️⃣ Set availability\n4️⃣ Submit and wait for approval\n\n💵 Estimated earnings:\n• Cars: $25-50/day\n• Motorbikes: $6-12/day\n• Bicycles: $3-8/day\n\n✅ We take a 10% commission from rentals.',
      action: {
        type: 'link',
        label: language === 'km' ? 'ទៅ List Vehicle' : 'Go to List Vehicle',
        url: '/list-vehicle'
      },
      suggestions: language === 'km'
        ? ['តើ commission ជាអ្វី?', 'តើត្រូវការ verify ID?']
        : ['What is commission?', 'Do I need to verify ID?']
    },
    {
      keywords: ['damage', 'problem', 'issue', 'បញ្ហា', 'accident', 'broken'],
      response: language === 'km'
        ? '🛡️ ការគ្របគ្រងការខូចខាត:\n\n📸 ស្ថានភាពយានយន្តត្រូវបានកត់ត្រា:\n• មុនពេលជួល: Photos និង inspection\n• បន្ទាប់ពីជួល: Photos និង inspection\n\n💰 Security Deposit:\n• ត្រូវបានការពារដោយប្រាក់កក់សុវត្ថិភាព\n• ការខូចខាតត្រូវបានវាយតម្លៃដោយយុត្តិធម៌\n• Deposit ត្រូវបានបង្វិលវិញបន្ទាប់ពីពិនិត្យ\n\n🚨 ប្រសិនបើមានបញ្ហា:\n1. ទាក់ទងម្ចាស់យានយន្តតាមរយៈ chat\n2. ថតរូបភាពនៃបញ្ហា\n3. ទាក់ទង support@ridesharelocal.com\n\n✅ យើងមាន dispute resolution process ដើម្បីជួយដោះស្រាយបញ្ហា។'
        : '🛡️ Damage Management:\n\n📸 Vehicle condition is documented:\n• Before rental: Photos and inspection\n• After rental: Photos and inspection\n\n💰 Security Deposit:\n• Protected by security deposit\n• Damage is assessed fairly\n• Deposit refunded after inspection\n\n🚨 If there\'s an issue:\n1. Contact vehicle owner via chat\n2. Take photos of the problem\n3. Contact support@ridesharelocal.com\n\n✅ We have a dispute resolution process to help resolve issues.',
      suggestions: language === 'km'
        ? ['តើ deposit ត្រូវបង្វិលវិញពេលណា?', 'តើអាច dispute?']
        : ['When is deposit refunded?', 'Can I dispute?']
    },
    {
      keywords: ['help', 'support', 'ជំនួយ', 'contact', 'ទាក់ទង'],
      response: language === 'km'
        ? '📞 ទំនាក់ទំនង Support:\n\n💬 Chat Bot: ខ្ញុំនៅទីនេះជារៀងរាល់ពេល!\n📧 Email: support@ridesharelocal.com\n📱 Phone: +855 23 123 456\n🌐 Help Center: /help-center\n\n⏰ Support Hours:\n• Monday - Friday: 8AM - 8PM\n• Saturday - Sunday: 9AM - 6PM\n• Emergency: 24/7 via email\n\n💡 សម្រាប់បញ្ហាបន្ទាន់ សូមទាក់ទងតាម email ឬ phone។'
        : '📞 Contact Support:\n\n💬 Chat Bot: I\'m here 24/7!\n📧 Email: support@ridesharelocal.com\n📱 Phone: +855 23 123 456\n🌐 Help Center: /help-center\n\n⏰ Support Hours:\n• Monday - Friday: 8AM - 8PM\n• Saturday - Sunday: 9AM - 6PM\n• Emergency: 24/7 via email\n\n💡 For urgent issues, please contact via email or phone.',
      action: {
        type: 'link',
        label: language === 'km' ? 'ទៅ Help Center' : 'Visit Help Center',
        url: '/help-center'
      },
      suggestions: language === 'km'
        ? ['តើមាន phone support?', 'តើ response time?']
        : ['Do you have phone support?', 'What\'s response time?']
    },
    {
      keywords: ['safety', 'secure', 'សុវត្ថិភាព', 'safe', 'security'],
      response: language === 'km'
        ? '🛡️ សុវត្ថិភាពគឺជាអាទិភាពរបស់យើង:\n\n✅ ID Verification:\n• អ្នកប្រើប្រាស់ទាំងអស់ត្រូវតែផ្ទៀងផ្ទាត់ ID\n• Government-issued ID only\n• Verification within 24-48 hours\n\n📍 GPS Tracking:\n• Real-time location tracking\n• Vehicle security during rental\n• Helps resolve disputes\n\n💳 Secure Payments:\n• Encrypted payment processing\n• Secure deposit handling\n• Automatic refunds\n\n📋 Safety Guidelines:\n• All users must follow safety rules\n• Vehicle inspection before/after\n• 24/7 support for emergencies\n\n🔒 Privacy Protection:\n• Your data is encrypted\n• We never share your information\n• GDPR compliant'
        : '🛡️ Safety is our priority:\n\n✅ ID Verification:\n• All users must verify ID\n• Government-issued ID only\n• Verification within 24-48 hours\n\n📍 GPS Tracking:\n• Real-time location tracking\n• Vehicle security during rental\n• Helps resolve disputes\n\n💳 Secure Payments:\n• Encrypted payment processing\n• Secure deposit handling\n• Automatic refunds\n\n📋 Safety Guidelines:\n• All users must follow safety rules\n• Vehicle inspection before/after\n• 24/7 support for emergencies\n\n🔒 Privacy Protection:\n• Your data is encrypted\n• We never share your information\n• GDPR compliant',
      action: {
        type: 'link',
        label: language === 'km' ? 'មើល Safety Guidelines' : 'View Safety Guidelines',
        url: '/safety-guidelines'
      },
      suggestions: language === 'km'
        ? ['តើ GPS tracking ដើម្បីអ្វី?', 'តើ data មានសុវត្ថិភាព?']
        : ['Why GPS tracking?', 'Is my data safe?']
    }
  ];

  const getQuickActions = (context?: string[]) => {
    if (context && context.length > 0) {
      // Context-aware suggestions
      const lastTopic = context[context.length - 1];
      if (lastTopic.includes('verify') || lastTopic.includes('ផ្ទៀងផ្ទាត់')) {
        return language === 'km'
          ? ['តើយូរប៉ុណ្ណា?', 'តើត្រូវការ ID អ្វី?', 'របៀបផ្ទៀងផ្ទាត់']
          : ['How long?', 'What ID needed?', 'How to verify?'];
      }
      if (lastTopic.includes('rent') || lastTopic.includes('ជួល')) {
        return language === 'km'
          ? ['តើត្រូវការ verify?', 'តម្លៃប៉ុណ្ណា?', 'របៀប book']
          : ['Need to verify?', 'How much?', 'How to book?'];
      }
    }
    return language === 'km'
      ? ['របៀបផ្ទៀងផ្ទាត់ ID', 'របៀបជួល', 'របៀបលក់យានយន្ត', 'តម្លៃបង់ប្រាក់']
      : ['How to verify ID?', 'How to rent?', 'How to list vehicle?', 'Payment methods'];
  };

  const findResponse = (userMessage: string): { text: string; suggestions?: string[]; action?: any } => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for greetings
    if (lowerMessage.match(/^(hi|hello|hey|សួស្តី|ជំរាបសួរ)/)) {
      return {
        text: language === 'km'
          ? 'សួស្តី! 😊 តើខ្ញុំអាចជួយអ្នកដោយរបៀបណា?'
          : 'Hello! 😊 How can I help you today?',
        suggestions: getQuickActions()
      };
    }

    // Check for thanks
    if (lowerMessage.match(/(thanks|thank you|អរគុណ|អរគុណច្រើន)/)) {
      return {
        text: language === 'km'
          ? 'អរគុណ! 😊 ប្រសិនបើអ្នកមានសំណួរផ្សេងទៀត សូមសួរខ្ញុំ!'
          : 'You\'re welcome! 😊 If you have more questions, feel free to ask!',
        suggestions: getQuickActions()
      };
    }

    // Check for quick actions
    if (lowerMessage.includes('verify') || lowerMessage.includes('ផ្ទៀងផ្ទាត់')) {
      const faq = faqData[0];
      return {
        text: faq.response,
        suggestions: faq.suggestions,
        action: faq.action
      };
    }
    if (lowerMessage.includes('rent') || lowerMessage.includes('ជួល')) {
      const faq = faqData[3];
      return {
        text: faq.response,
        suggestions: faq.suggestions,
        action: faq.action
      };
    }
    if (lowerMessage.includes('list') || lowerMessage.includes('លក់')) {
      const faq = faqData[4];
      return {
        text: faq.response,
        suggestions: faq.suggestions,
        action: faq.action
      };
    }
    if (lowerMessage.includes('contact') || lowerMessage.includes('ទំនាក់ទំនង')) {
      const faq = faqData[6];
      return {
        text: faq.response,
        suggestions: faq.suggestions,
        action: faq.action
      };
    }

    // Check keywords with scoring
    let bestMatch = null;
    let bestScore = 0;

    for (const faq of faqData) {
      const score = faq.keywords.reduce((acc, keyword) => {
        if (lowerMessage.includes(keyword.toLowerCase())) {
          return acc + 1;
        }
        return acc;
      }, 0);
      
      if (score > bestScore) {
        bestScore = score;
        bestMatch = faq;
      }
    }

    if (bestMatch && bestScore > 0) {
      return {
        text: bestMatch.response,
        suggestions: bestMatch.suggestions,
        action: bestMatch.action
      };
    }

    // Default response with helpful suggestions
    return {
      text: language === 'km'
        ? 'សុំទោស ខ្ញុំមិនយល់សេចក្តីនោះទេ។ 😅\n\nសូមសួរសំណួរផ្សេងទៀត ឬជ្រើសរើសពី quick actions ខាងលើ។ អ្នកក៏អាចទៅមើល Help Center សម្រាប់ព័ត៌មានលម្អិតបន្ថែម។'
        : 'Sorry, I didn\'t understand that. 😅\n\nPlease ask a different question or choose from the quick actions above. You can also visit the Help Center for more detailed information.',
      suggestions: getQuickActions(),
      action: {
        type: 'link',
        label: language === 'km' ? 'ទៅ Help Center' : 'Visit Help Center',
        url: '/help-center'
      }
    };
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setConversationContext(prev => [...prev, inputText.toLowerCase()].slice(-3)); // Keep last 3 messages
    const currentInput = inputText;
    setInputText('');
    setIsTyping(true);

    // Simulate bot thinking with typing indicator
    setTimeout(() => {
      const response = findResponse(currentInput);
      setIsTyping(false);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: 'bot',
        timestamp: new Date(),
        suggestions: response.suggestions,
        action: response.action
      };
      setMessages(prev => [...prev, botMessage]);
    }, 800 + Math.random() * 400); // Random delay 800-1200ms for more natural feel
  };

  const handleQuickAction = (text: string) => {
    setInputText(text);
    // Auto-send after a brief moment
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const handleAction = (action: any) => {
    if (action?.type === 'link' && action?.url) {
      navigate(action.url);
      setIsOpen(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-primary-blue to-primary-orange text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform duration-300 z-50"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-blue to-primary-orange text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold">RideShare Support</h3>
                <p className="text-xs opacity-90">Online</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
            {messages.map((message) => (
              <div key={message.id} className="space-y-2">
                <div
                  className={`flex gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender === 'bot' && (
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-blue to-primary-orange rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-primary-blue to-primary-orange text-white shadow-lg'
                        : 'bg-white text-gray-800 shadow-md border border-gray-200'
                    } animate-fade-in`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
                    <p className="text-xs opacity-70 mt-2">{formatTime(message.timestamp)}</p>
                  </div>
                  {message.sender === 'user' && (
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-blue to-primary-orange rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                      <UserIcon className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
                
                {/* Suggestions */}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 ml-10">
                    {message.suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuickAction(suggestion)}
                        className="px-3 py-1.5 text-xs bg-primary-orange/10 hover:bg-primary-orange hover:text-white text-primary-orange rounded-full transition-all duration-200 border border-primary-orange/20"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}

                {/* Action Button */}
                {message.action && (
                  <div className="ml-10">
                    <button
                      onClick={() => handleAction(message.action)}
                      className="px-4 py-2 text-sm bg-gradient-to-r from-primary-blue to-primary-orange text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      {message.action.label}
                    </button>
                  </div>
                )}
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2 justify-start">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-blue to-primary-orange rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white text-gray-800 shadow-md border border-gray-200 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions - Show when no messages or after bot response */}
          {messages.length <= 1 && (
            <div className="px-4 py-3 bg-gradient-to-r from-primary-blue/5 to-primary-orange/5 border-t border-gray-200">
              <p className="text-xs text-gray-600 mb-2 font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-primary-orange" />
                {language === 'km' ? 'សកម្មភាពរហ័ស:' : 'Quick actions:'}
              </p>
              <div className="flex flex-wrap gap-2">
                {getQuickActions().map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action)}
                    className="px-3 py-1.5 text-xs bg-white hover:bg-primary-orange hover:text-white text-primary-orange rounded-full transition-all duration-200 border border-primary-orange/20 shadow-sm hover:shadow-md"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-200 rounded-b-2xl">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={language === 'km' ? 'បញ្ចូលសាររបស់អ្នក...' : 'Type your message...'}
                className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-full focus:outline-none focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20 transition-all"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                className="w-10 h-10 bg-gradient-to-r from-primary-blue to-primary-orange text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
              <HelpCircle className="w-3 h-3" />
              <Link to="/help-center" className="hover:text-primary-orange">
                {language === 'km' ? 'ទៅមើល Help Center' : 'Visit Help Center'}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;

