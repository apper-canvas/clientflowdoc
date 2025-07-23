import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    // Account Settings
    emailNotifications: true,
    desktopNotifications: false,
    twoFactorAuth: false,
    
    // Application Preferences
    theme: 'light',
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    
    // Privacy & Security
    profileVisibility: 'private',
    dataSharing: false,
    activityTracking: true,
    
    // Notification Preferences
    projectUpdates: true,
    taskReminders: true,
    clientMessages: true,
    weeklyReports: false,
    
    // Integration Settings
    slackIntegration: false,
    emailIntegration: true,
    calendarSync: false
  });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage
      localStorage.setItem('userSettings', JSON.stringify(settings));
      
      toast.success('Settings saved successfully!');
      setHasChanges(false);
    } catch (error) {
      toast.error('Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    const defaultSettings = {
      emailNotifications: true,
      desktopNotifications: false,
      twoFactorAuth: false,
      theme: 'light',
      language: 'en',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      profileVisibility: 'private',
      dataSharing: false,
      activityTracking: true,
      projectUpdates: true,
      taskReminders: true,
      clientMessages: true,
      weeklyReports: false,
      slackIntegration: false,
      emailIntegration: true,
      calendarSync: false
    };
    
    setSettings(defaultSettings);
    setHasChanges(true);
    toast.info('Settings reset to defaults');
  };

  const ToggleSwitch = ({ enabled, onChange, disabled = false }) => (
    <button
      onClick={() => !disabled && onChange(!enabled)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
        enabled ? 'bg-primary-600' : 'bg-gray-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  const SelectField = ({ value, onChange, options, disabled = false }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${
        disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
      }`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900 font-display"
          >
            Settings
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-2 text-gray-600"
          >
            Manage your account preferences and application settings
          </motion.p>
        </div>

        <div className="space-y-8">
          {/* Account Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center mb-6">
              <ApperIcon name="User" size={20} className="text-primary-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Account Settings</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive notifications about project updates</p>
                </div>
                <ToggleSwitch
                  enabled={settings.emailNotifications}
                  onChange={(value) => handleSettingChange('emailNotifications', value)}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">Desktop Notifications</p>
                  <p className="text-sm text-gray-500">Show desktop notifications for important updates</p>
                </div>
                <ToggleSwitch
                  enabled={settings.desktopNotifications}
                  onChange={(value) => handleSettingChange('desktopNotifications', value)}
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSettingChange('twoFactorAuth', !settings.twoFactorAuth)}
                >
                  {settings.twoFactorAuth ? 'Disable' : 'Enable'}
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Application Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center mb-6">
              <ApperIcon name="Settings" size={20} className="text-primary-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Application Preferences</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="theme">Theme</Label>
                <SelectField
                  value={settings.theme}
                  onChange={(value) => handleSettingChange('theme', value)}
                  options={[
                    { value: 'light', label: 'Light' },
                    { value: 'dark', label: 'Dark' },
                    { value: 'auto', label: 'Auto' }
                  ]}
                />
              </div>

              <div>
                <Label htmlFor="language">Language</Label>
                <SelectField
                  value={settings.language}
                  onChange={(value) => handleSettingChange('language', value)}
                  options={[
                    { value: 'en', label: 'English' },
                    { value: 'es', label: 'Spanish' },
                    { value: 'fr', label: 'French' },
                    { value: 'de', label: 'German' }
                  ]}
                />
              </div>

              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <SelectField
                  value={settings.timezone}
                  onChange={(value) => handleSettingChange('timezone', value)}
                  options={[
                    { value: 'UTC', label: 'UTC' },
                    { value: 'EST', label: 'Eastern Time' },
                    { value: 'PST', label: 'Pacific Time' },
                    { value: 'CET', label: 'Central European Time' }
                  ]}
                />
              </div>

              <div>
                <Label htmlFor="dateFormat">Date Format</Label>
                <SelectField
                  value={settings.dateFormat}
                  onChange={(value) => handleSettingChange('dateFormat', value)}
                  options={[
                    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
                  ]}
                />
              </div>
            </div>
          </motion.div>

          {/* Privacy & Security */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center mb-6">
              <ApperIcon name="Shield" size={20} className="text-primary-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Privacy & Security</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">Profile Visibility</p>
                  <p className="text-sm text-gray-500">Control who can see your profile information</p>
                </div>
                <SelectField
                  value={settings.profileVisibility}
                  onChange={(value) => handleSettingChange('profileVisibility', value)}
                  options={[
                    { value: 'public', label: 'Public' },
                    { value: 'private', label: 'Private' },
                    { value: 'team', label: 'Team Only' }
                  ]}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">Data Sharing</p>
                  <p className="text-sm text-gray-500">Allow anonymous usage data to help improve the app</p>
                </div>
                <ToggleSwitch
                  enabled={settings.dataSharing}
                  onChange={(value) => handleSettingChange('dataSharing', value)}
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900">Activity Tracking</p>
                  <p className="text-sm text-gray-500">Track your activity for analytics and insights</p>
                </div>
                <ToggleSwitch
                  enabled={settings.activityTracking}
                  onChange={(value) => handleSettingChange('activityTracking', value)}
                />
              </div>
            </div>
          </motion.div>

          {/* Notification Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center mb-6">
              <ApperIcon name="Bell" size={20} className="text-primary-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">Project Updates</p>
                  <p className="text-sm text-gray-500">Get notified when projects are updated</p>
                </div>
                <ToggleSwitch
                  enabled={settings.projectUpdates}
                  onChange={(value) => handleSettingChange('projectUpdates', value)}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">Task Reminders</p>
                  <p className="text-sm text-gray-500">Receive reminders for upcoming task deadlines</p>
                </div>
                <ToggleSwitch
                  enabled={settings.taskReminders}
                  onChange={(value) => handleSettingChange('taskReminders', value)}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">Client Messages</p>
                  <p className="text-sm text-gray-500">Get notified when clients send messages</p>
                </div>
                <ToggleSwitch
                  enabled={settings.clientMessages}
                  onChange={(value) => handleSettingChange('clientMessages', value)}
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900">Weekly Reports</p>
                  <p className="text-sm text-gray-500">Receive weekly summary reports</p>
                </div>
                <ToggleSwitch
                  enabled={settings.weeklyReports}
                  onChange={(value) => handleSettingChange('weeklyReports', value)}
                />
              </div>
            </div>
          </motion.div>

          {/* Integration Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center mb-6">
              <ApperIcon name="Zap" size={20} className="text-primary-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Integration Settings</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <ApperIcon name="MessageSquare" size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Slack Integration</p>
                    <p className="text-sm text-gray-500">Connect with your Slack workspace</p>
                  </div>
                </div>
                <Button
                  variant={settings.slackIntegration ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSettingChange('slackIntegration', !settings.slackIntegration)}
                >
                  {settings.slackIntegration ? 'Connected' : 'Connect'}
                </Button>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <ApperIcon name="Mail" size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Email Integration</p>
                    <p className="text-sm text-gray-500">Sync with your email client</p>
                  </div>
                </div>
                <Button
                  variant={settings.emailIntegration ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSettingChange('emailIntegration', !settings.emailIntegration)}
                >
                  {settings.emailIntegration ? 'Connected' : 'Connect'}
                </Button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <ApperIcon name="Calendar" size={16} className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Calendar Sync</p>
                    <p className="text-sm text-gray-500">Sync tasks and deadlines with your calendar</p>
                  </div>
                </div>
                <Button
                  variant={settings.calendarSync ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSettingChange('calendarSync', !settings.calendarSync)}
                >
                  {settings.calendarSync ? 'Connected' : 'Connect'}
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-end"
          >
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={loading}
            >
              Reset to Defaults
            </Button>
            
            <Button
              onClick={handleSave}
              disabled={!hasChanges || loading}
            >
              {loading ? (
                <>
                  <ApperIcon name="Loader2" size={16} className="animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <ApperIcon name="Save" size={16} className="mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;