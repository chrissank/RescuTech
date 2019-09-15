package tech.resqu.drone;

import android.app.IntentService;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.IBinder;
import android.util.Log;

import com.google.firebase.database.annotations.Nullable;

public class LocationService extends IntentService {

    String TAG = "drone";

    public LocationService() {
        super("DroneLocation");
    }

    @Override
    public IBinder onBind(Intent arg0) {
        return null;
    }

    @Override
    protected void onHandleIntent(@Nullable Intent intent) {

    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.d(TAG, "start command");
        startForeground(121, buildNotification());
        new LocationUpdate().requestLocations();
        return START_STICKY;
    }

    public Notification buildNotification() {
        Log.d("drone", " test6");
        Intent notificationIntent = new Intent(this, MainActivity.class);
        notificationIntent.setAction(Intent.ACTION_MAIN);
        notificationIntent.addCategory(Intent.CATEGORY_LAUNCHER);
        notificationIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        PendingIntent pendingIntent =
                PendingIntent.getActivity(this, 0, notificationIntent, 0);
        Notification notification = null;
        if(Build.VERSION.SDK_INT > 25) {
            NotificationManager mNotificationManager =
                    (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            NotificationChannel channel = new NotificationChannel("default",
                    "RESQU_DRONE_CHANNEL",
                    NotificationManager.IMPORTANCE_DEFAULT);
            channel.setDescription("RESQU_DRONE_CHANNEL");
            mNotificationManager.createNotificationChannel(channel);
            notification =
                    new Notification.Builder(this, "default")
                            .setSmallIcon(R.drawable.ic_launcher_foreground)
                            .setContentTitle("RESQU DRONE Running")
                            .setContentIntent(pendingIntent)
                            .build();

        }
        return(notification);
    }

}
