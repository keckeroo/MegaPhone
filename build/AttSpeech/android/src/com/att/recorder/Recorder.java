package com.att.recorder;


import java.io.IOException;
import android.media.MediaRecorder;

import org.apache.cordova.api.CallbackContext;
import org.apache.cordova.api.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class Recorder extends CordovaPlugin  {
     private static MediaRecorder recorder;

	public boolean execute(String action,JSONArray args, CallbackContext callbackContext){

		if(action.equalsIgnoreCase("start"))
		{
			System.out.println("Sending call to start.....");
			return this.start(args, callbackContext);

		}else if(action.equalsIgnoreCase("stop"))
		{
			System.out.println("Sending call to stop ....");
			return this.stop(callbackContext);

		}
		return false;

	}
/**
 * Method used to start the Audio Recording.
 * @param args
 * @return boolean value
 */

public boolean start(JSONArray args, CallbackContext callbackContext){

	String filePath=null;
	int audioChannels = 0,samplingRate=0,encodingBitRate=0;
	JSONObject json = null;

	if (recorder != null) {
		System.out.println("Recorder already started.");
		callbackContext.error("Recorder already started.");
		return false;
	}

	System.out.println("Recorder was triggered.........");
	try {
		json = args.getJSONObject(0);
	} catch (JSONException e1) {
		// TODO Auto-generated catch block
		e1.printStackTrace();
	}
	if(json.has("filePath"))
	{
		try {
			filePath = json.getString("filePath");
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}	
	}
	if(json.has("audioChannels"))
	{
		try {
			audioChannels = json.getInt("audioChannels");
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}	
	}
	if(json.has("samplingRate"))
	{
		try {
			samplingRate = json.getInt("samplingRate");
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}	
	}
	if(json.has("encodingBitRate"))
	{
		try {
			encodingBitRate = json.getInt("encodingBitRate");
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}	
	}
	boolean recordingStarted = false;
	try {
		// TODO file validation checks
		recorder = new MediaRecorder();
		recorder.setAudioSource(MediaRecorder.AudioSource.MIC);
		recorder.setOutputFormat(MediaRecorder.OutputFormat.AMR_NB);
		recorder.setAudioEncoder(MediaRecorder.AudioEncoder.AMR_NB);
		recorder.setOutputFile(filePath);

		// TODO these may change -->
		recorder.setAudioChannels(audioChannels);
		recorder.setAudioSamplingRate(samplingRate);
		recorder.setAudioEncodingBitRate(encodingBitRate);
		// <-----

		try {
			System.out.println("Preparing recorder.....");
			recorder.prepare();
		} catch (IllegalStateException e) {
			System.out
					.println("While preparing recorder...Error Occured !!");
			e.printStackTrace();
			throw e;
		} catch (IOException e) {
			System.out
					.println("While preparing recorder...Error Occured !!");
			e.printStackTrace();
			throw e;
		}

		System.out.println("Starting recorder.....");
		recorder.start(); // Recording is now started
		recordingStarted = true;
		callbackContext.success();

	} catch (Exception e) {
		callbackContext.error("Error starting recording.");
	}

	return recordingStarted;
}
/**
 * Method used to stop the Audio Recording.
 * @return boolean value
 */
public boolean stop(CallbackContext callbackContext) {
	boolean recorderStopped = false;
	try {
		if (recorder == null) {
			throw new Exception("Recorder never started !!");
		}

		recorder.stop();
		System.out.println("Recorder Stopped !!");

		recorder.release(); // Now the object cannot be reused
		System.out.println("Recorder Released !!");

		recorder = null;
		callbackContext.success();
		recorderStopped = true;
	} catch (Exception e) {
		e.printStackTrace();
		callbackContext.error("Error stopping recording");
	}
	return recorderStopped;
}

}