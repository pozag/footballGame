import java.io.File;
import java.util.ArrayList;
import java.util.Scanner;
import java.io.FileNotFoundException;
import java.util.Arrays;
import java.lang.StringBuilder;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Iterator;

public class playerInfo {
    public static void main (String[] argv) {
	File file = new File("playerInfo.txt");
	ArrayList<String> data = new ArrayList<String>();
	StringBuilder sb;
	int count = 0;
	String line;
	try {
	    Scanner sc = new Scanner(file);
	    String firstLine = sc.nextLine();
	    while (sc.hasNextLine()) {
		int counto = 2;
		line = sc.nextLine();
		line = line.trim().replaceAll("\\s+", " ");
		String[] arr = line.split("\\s+");
		sb = new StringBuilder();
		sb.append(arr[0] + " " + arr[1]);
		if (arr[2].equals("II") || arr[2].equals("Jr") || arr[2].equals("Sr") || arr[2].equals("III")) {
		    counto = 3;
		    sb.append(" " + arr[2] + ", ");
		} else {
		    sb.append(", ");
		}
		for (int i = counto; i < arr.length; i++) {
		    if (arr[i].equals("AFC") || arr[i].equals("NFC")) {
			counto = i;
			break;
		    }
		    sb.append(arr[i] + " ");		    
		}
		sb.setLength(sb.length() - 1);
		sb.append(", ");
		for (int i = counto; i < arr.length; i++) {
		    if (arr[i].equals("Left") || arr[i].equals("Right")) {
			counto = i;
			break;
		    }
		    sb.append(arr[i] + ", ");
		}
		for (int i = counto; i < counto + 5; i++) {
		    if (arr[i].equals("$")) {
			continue;
		    }
		    sb.append(arr[i] + ", ");
		}
		StringBuilder temp = new StringBuilder();
		for (int i = counto + 5; i < arr.length; i++) {
		    temp.append(arr[i] + " ");
		}
		sb.append(temp.toString().trim());
		data.add(sb.toString());
	    }
	} catch (FileNotFoundException e) {}
	for (int i = 0; i < data.size(); i++) {
	    System.out.println(data.get(i));
	}
    }
}
