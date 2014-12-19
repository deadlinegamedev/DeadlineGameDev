using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Threading;
using DeadlineGameDev.Timer.Annotations;

namespace DeadlineGameDev.Timer
{
    public class MainViewModel : INotifyPropertyChanged
    {
        public event PropertyChangedEventHandler PropertyChanged;

        [NotifyPropertyChangedInvocator]
        protected virtual void OnPropertyChanged([CallerMemberName] string propertyName = null)
        {
            PropertyChangedEventHandler handler = PropertyChanged;
            if (handler != null) handler(this, new PropertyChangedEventArgs(propertyName));
        }

        private readonly DispatcherTimer _timeTimer;

        private TimeSpan _remainingTime = Properties.Settings.Default.Duration;
        private SolidColorBrush _brush = Brush1;
        private Brush _border = Brushes.Black;
        private Dispatcher _dispatcher;

        public TimeSpan RemainingTime
        {
            get { return _remainingTime; }
            set
            {
                if (value <= TimeSpan.Zero)
                {
                    if (_remainingTime <= TimeSpan.Zero)
                        return;
                    _remainingTime = TimeSpan.Zero;
                    TimeOut();
                }
                else
                {
                    if (value.Equals(_remainingTime)) return;
                    _remainingTime = value;
                }
                OnPropertyChanged();
                OnPropertyChanged("Text");
            }
        }

        public bool IsPaused { get; set; }

        public string Text
        {
            get
            {
                return string.Format("{0:hh\\:mm\\:ss}", RemainingTime);
            }
        }

        public double FontSize
        {
            get { return Properties.Settings.Default.FontSize; }
        }

        public SolidColorBrush Brush
        {
            get { return _brush; }
            set
            {
                if (Equals(value, _brush)) return;
                _brush = value;
                OnPropertyChanged();
            }
        }

        public static SolidColorBrush Brush1
        {
            get { return new SolidColorBrush(Color.FromRgb(Properties.Settings.Default.Color1.R, Properties.Settings.Default.Color1.G, Properties.Settings.Default.Color1.B)); }
        }

        public static SolidColorBrush Brush2
        {
            get { return new SolidColorBrush(Color.FromRgb(Properties.Settings.Default.Color2.R, Properties.Settings.Default.Color2.G, Properties.Settings.Default.Color2.B)); }
        }

        public static SolidColorBrush PauseBrush1
        {
            get { return new SolidColorBrush(Color.FromRgb(Properties.Settings.Default.PauseColor1.R, Properties.Settings.Default.PauseColor1.G, Properties.Settings.Default.PauseColor1.B)); }
        }

        public static SolidColorBrush PauseBrush2
        {
            get { return new SolidColorBrush(Color.FromRgb(Properties.Settings.Default.PauseColor2.R, Properties.Settings.Default.PauseColor2.G, Properties.Settings.Default.PauseColor2.B)); }
        }

        public Brush Border
        {
            get { return _border; }
            set { _border = value; }
        }

        public ICommand PauseCommand { get; set; }
        public ICommand ResumeCommand { get; set; }
        public ICommand ResetCommand { get; set; }
        public ICommand SettingsCommand { get; set; }
        public ICommand ExitCommand { get; set; }

        public event Action Restart = () => { };
        public event Action TimeOut = () => { };

        public MainViewModel()
        {
            _dispatcher = Dispatcher.CurrentDispatcher;
            _timeTimer = new DispatcherTimer(TimeSpan.FromSeconds(0.5), DispatcherPriority.Normal, TimeCallback, _dispatcher);

            PauseCommand = new ActionCommand(() => IsPaused = true);
            ResumeCommand = new ActionCommand(() => IsPaused = false);
            ResetCommand = new ActionCommand(() => Confirm("reset", () =>
            {
                RemainingTime = Properties.Settings.Default.Duration;
                Brush = Brush1;
                Restart();
            }));
            SettingsCommand = new ActionCommand(() => new Settings().ShowDialog());
            ExitCommand = new ActionCommand(() => Confirm("close", MainWindow.Instance.Close));
        }

        public void Confirm(string name, Action action)
        {
            if (MessageBox.Show(MainWindow.Instance, "Do you really want to " + name + " the timer?", "Timer", MessageBoxButton.YesNo) ==
                MessageBoxResult.Yes)
                action();
        }

        private void TimeCallback(object sender, EventArgs eventArgs)
        {
            if (IsPaused)
            {
                Brush = Equals(Brush, PauseBrush1) ? PauseBrush2 : PauseBrush1;   
            }
            else
            {
                RemainingTime = RemainingTime - _timeTimer.Interval;
                Brush = Equals(Brush, Brush1) ? Brush2 : Brush1;
            }
        }

        private bool Equals(SolidColorBrush a, SolidColorBrush b)
        {
            return a.Color.Equals(b.Color);
        }
    }
}
