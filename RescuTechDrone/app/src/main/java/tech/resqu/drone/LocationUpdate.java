package tech.resqu.drone;

import android.Manifest;
import android.content.pm.PackageManager;
import android.location.Location;
import android.util.Log;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;

import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;


public class LocationUpdate {

    private static final long INTERVAL = 1000 * 10;
    private static final long FASTEST_INTERVAL = 1000 * 2;
    public LocationRequest mLocationRequest;
    private FusedLocationProviderClient mFusedLocationClient;
    private LocationCallback callback;

    public LocationUpdate() {
        mFusedLocationClient = LocationServices.getFusedLocationProviderClient(MainActivity.instance);
        createLocationRequest();
        createCallback();
    }

    protected void createLocationRequest() {
        mLocationRequest = new LocationRequest()
                .setInterval(INTERVAL)
                .setFastestInterval(FASTEST_INTERVAL)
                .setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);
    }

    public void requestLocations() {
        Log.d("drone", "awhuoahwudohawoidnao");
        if (ContextCompat.checkSelfPermission(MainActivity.instance, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(MainActivity.instance,
                    new String[]{Manifest.permission.ACCESS_FINE_LOCATION},
                    99);
        }
        mFusedLocationClient.requestLocationUpdates(mLocationRequest, callback, null);
    }

    public void stopRequesting() {
        mFusedLocationClient.removeLocationUpdates(callback);
    }


    public void createCallback() {
        callback = new LocationCallback() {
            @Override
            public void onLocationResult(LocationResult locationResult) {
                if (locationResult == null) {
                    return;
                }
                for (Location location : locationResult.getLocations()) {
                    Log.d("drone", " test41");
                    Map<String, Object> newLoc = new HashMap<>();
                    newLoc.put("latitude", location.getLatitude());
                    newLoc.put("longitude", location.getLongitude());
                    MainActivity.llat = location.getLatitude();
                    MainActivity.llong = location.getLongitude();
                    MainActivity.instance.firebase.getReference("disasters/" + MainActivity.instance.auth.getCurrentUser().getUid() + "/drones/" + MainActivity.instance.id)
                            .updateChildren(newLoc);
                }
            }
        };
    }

}
