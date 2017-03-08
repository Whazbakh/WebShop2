package dk.cs.dwebtek;


public class ShopResponse {
    private boolean succes;
    private String message;

    public ShopResponse(boolean succes, String message) {
        this.succes = succes;
        this.message = message;
    }

    public boolean isSucces() {
        return succes;
    }

    public void setSucces(boolean succes) {
        this.succes = succes;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
