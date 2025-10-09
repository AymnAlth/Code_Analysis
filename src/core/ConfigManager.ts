import { AppConfig, DEFAULT_CONFIG } from '../config';

export class ConfigManager {
  private static instance: ConfigManager;
  private config: AppConfig;

  private constructor() {
    this.config = this.loadConfig();
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  /**
   * تحميل الإعدادات من localStorage أو استخدام الافتراضية
   */
  private loadConfig(): AppConfig {
    try {
      const savedConfig = localStorage.getItem('code-review-config');
      if (savedConfig) {
        return { ...DEFAULT_CONFIG, ...JSON.parse(savedConfig) };
      }
    } catch (error) {
      console.warn('فشل في تحميل الإعدادات:', error);
    }
    return { ...DEFAULT_CONFIG };
  }

  /**
   * حفظ الإعدادات في localStorage
   */
  public saveConfig(newConfig: Partial<AppConfig>): void {
    this.config = { ...this.config, ...newConfig };
    try {
      localStorage.setItem('code-review-config', JSON.stringify(this.config));
    } catch (error) {
      console.error('فشل في حفظ الإعدادات:', error);
    }
  }

  /**
   * الحصول على جميع الإعدادات
   */
  public getConfig(): AppConfig {
    return { ...this.config };
  }

  /**
   * الحصول على إعداد معين
   */
  public getConfigValue<K extends keyof AppConfig>(key: K): AppConfig[K] {
    return this.config[key];
  }

  /**
   * تحديث إعداد معين
   */
  public updateConfigValue<K extends keyof AppConfig>(
    key: K, 
    value: AppConfig[K]
  ): void {
    this.config[key] = value;
    this.saveConfig({});
  }

  /**
   * إعادة تعيين الإعدادات للافتراضية
   */
  public resetToDefault(): void {
    this.config = { ...DEFAULT_CONFIG };
    localStorage.removeItem('code-review-config');
  }

  /**
   * التحقق من صحة مفتاح API
   */
  public isApiKeyValid(): boolean {
    return Boolean(this.config.ai.apiKey && this.config.ai.apiKey.trim());
  }

  /**
   * التحقق من دعم لغة معينة
   */
  public isLanguageSupported(extension: string): boolean {
    return this.config.review.supportedLanguages.some(
      lang => lang.extension === extension && lang.enabled
    );
  }
}