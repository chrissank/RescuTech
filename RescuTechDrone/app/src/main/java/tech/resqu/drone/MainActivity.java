package tech.resqu.drone;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.location.Location;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.TextView;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.ChildEventListener;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

import java.util.HashMap;
import java.util.Map;

public class MainActivity extends AppCompatActivity {

    FirebaseAuth auth;
    FirebaseDatabase firebase;
    public String id;
    private boolean active = false;
    private ChildEventListener v;
    private DatabaseReference r;
    private FusedLocationProviderClient fusedLocationClient;
    public static MainActivity instance;
    public LocationUpdate update;
    static double llat;
    static double llong;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        auth = FirebaseAuth.getInstance();
        firebase = FirebaseDatabase.getInstance();

        instance = this;

        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this);
        id = getIntent().getStringExtra("DRONE_ID");
    }

    public void switchActive(View view) {
        if(active) {
            deactivateDrone();
            active = false;
        } else {
            active = true;
            activateDrone();
        }
    }

    public void activateDrone() {
        ((TextView) findViewById(R.id.active)).setText("ACTIVE");
        ((TextView) findViewById(R.id.active)).setTextColor(getResources().getColor(R.color.green));

        final FirebaseUser currentUser = auth.getCurrentUser();
        firebase.getReference("disasters/" + currentUser.getUid() + "/drones/" + id + "/active").setValue(true);
        v = new ChildEventListener() {
            @Override
            public void onChildAdded(@NonNull DataSnapshot dataSnapshot, @Nullable String s) {
                Log.e("drone", dataSnapshot.getKey());
                HashMap<String, Object> values = (HashMap) dataSnapshot.getValue();
                if(values.containsKey("dlat")) return;
                Map<String, Object> newLoc = new HashMap<>();
                newLoc.put("dlat", llat);
                newLoc.put("dlong", llong);
                firebase.getReference("disasters/" + currentUser.getUid() + "/traps/" + dataSnapshot.getKey()).updateChildren(newLoc);
                // get location, set.
            }

            @Override
            public void onChildChanged(@NonNull DataSnapshot dataSnapshot, @Nullable String s) {}

            @Override
            public void onChildRemoved(@NonNull DataSnapshot dataSnapshot) {}

            @Override
            public void onChildMoved(@NonNull DataSnapshot dataSnapshot, @Nullable String s) {}

            @Override
            public void onCancelled(DatabaseError error) { }
        };
        r = firebase.getReference("disasters/" + currentUser.getUid() + "/traps");
        r.addChildEventListener(v);

        Log.d("drone", "test");
        if (Build.VERSION.SDK_INT > 25) {
            Log.d("drone", "t3est");
            Intent serviceIntent = new Intent(this, LocationService.class);
            startForegroundService(serviceIntent);
        } else {
            Log.d("drone", "tes6t");
            update = new LocationUpdate();
            update.requestLocations();
        }

    }

    public void deactivateDrone() {
        ((TextView) findViewById(R.id.active)).setText("DE-ACTIVE");
        ((TextView) findViewById(R.id.active)).setTextColor(getResources().getColor(R.color.white));
        final FirebaseUser currentUser = auth.getCurrentUser();
        firebase.getReference("disasters/" + currentUser.getUid() + "/drones/" + id + "/active").setValue(false);
        r.removeEventListener(v);
        if (Build.VERSION.SDK_INT > 25) {
            stopService(new Intent(this, LocationService.class));
        } else {
            update.stopRequesting();
        }

    }

}
