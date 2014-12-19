using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;
using System.Timers;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Windows.Threading;
using DeadlineGameDev.Timer.Annotations;

namespace DeadlineGameDev.Timer
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        private DispatcherTimer _timer;
        public static MainWindow Instance { get; private set; }

        public MainWindow()
        {
            Instance = this;
            InitializeComponent();
            ViewModel.Restart += () => PositionAtCorner(false);
            ViewModel.TimeOut += Maximize;
            _timer = new DispatcherTimer(TimeSpan.FromSeconds(0.1), DispatcherPriority.Normal, Callback, Dispatcher);
            _timer.Start();
        }

        private void Callback(object sender, EventArgs eventArgs)
        {
            if (ViewModel.RemainingTime <= TimeSpan.Zero)
                return;

            if (IsInLeftRect(GetMousePosition()))
            {
                PositionAtCorner(true);
            }
            else
            {
                PositionAtCorner(false);
            }
        }

        private bool IsInLeftRect(Point point)
        {
            return point.X > 0 && point.X < ActualWidth && point.Y > Top && point.Y < Top + ActualHeight;
        }

        public Point GetMousePosition()
        {
            System.Drawing.Point point = System.Windows.Forms.Control.MousePosition;
            return new Point(point.X, point.Y);
        }

        public void PositionAtCorner(bool alternativePosition)
        {
            ScaleTransform.ScaleX = ScaleTransform.ScaleY = 1;
            Width = double.NaN;
            Height = double.NaN;
            SizeToContent = SizeToContent.WidthAndHeight;
            Left = alternativePosition ? SystemParameters.WorkArea.Width - ActualWidth : 0;
            Top = SystemParameters.WorkArea.Height - ActualHeight;
        }

        private void Maximize()
        {
            SizeToContent = SizeToContent.Manual;
            Left = 0;
            Top = 0;
            Width = SystemParameters.WorkArea.Width;
            Height = SystemParameters.WorkArea.Height;
            ScaleTransform.ScaleX = ScaleTransform.ScaleY = Width/Text.ActualWidth;
        }

        private MainViewModel ViewModel
        {
            get { return (MainViewModel)DataContext; }
        }

        private void MainWindow_OnLoaded(object sender, RoutedEventArgs e)
        {
            PositionAtCorner(false);
        }
    }
}
