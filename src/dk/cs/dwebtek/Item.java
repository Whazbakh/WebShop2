package dk.cs.dwebtek;

public class Item {

    private int id;
    private String name;
    private int price;
    private String url;
    private int stock;
    private String description;

    public Item() {
    }

    public Item(int id, String name, String url, int price, int stock, String description) {
        this.id = id;
        this.name = name;
        this.url = url;
        this.price = price;
        this.stock = stock;
        this.description = description;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public String getURL() {
        return url;
    }

    public void setURL(String URL) {
        this.url = url;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

}