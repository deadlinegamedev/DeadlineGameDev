using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;
using DeadlineGameDev.Timer.Annotations;

namespace DeadlineGameDev.Timer
{
    public class SettingsViewModel : INotifyPropertyChanged
    {
        public event PropertyChangedEventHandler PropertyChanged;

        [NotifyPropertyChangedInvocator]
        protected virtual void OnPropertyChanged([CallerMemberName] string propertyName = null)
        {
            PropertyChangedEventHandler handler = PropertyChanged;
            if (handler != null) handler(this, new PropertyChangedEventArgs(propertyName));
        }

        public TimeSpan Duration
        {
            get { return Properties.Settings.Default.Duration; }
            set
            {
                if (value.Equals(Properties.Settings.Default.Duration)) return;
                Properties.Settings.Default.Duration = value;
                Properties.Settings.Default.Save();
                OnPropertyChanged();
            }
        }
    }
}
