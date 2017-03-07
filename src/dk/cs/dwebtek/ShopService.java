package dk.cs.dwebtek;

import dk.cs.au.dwebtek.CloudService;
import dk.cs.au.dwebtek.OperationResult;
import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.Namespace;
import org.json.JSONArray;
import org.json.JSONObject;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.List;

import static org.jdom2.Namespace.getNamespace;

@Path("shop")
public class ShopService {
    /**
     * Our Servlet session. We will need this for the shopping basket
     */
    private HttpSession session;
    private static final Namespace NS = getNamespace("http://www.cs.au.dk/dWebTek/2014");
    private static CloudService service = new CloudService();

    public ShopService(@Context HttpServletRequest servletRequest) {
        session = servletRequest.getSession();
    }

    /**
     * Make the price increase per request (for the sake of example)
     */
    private static int priceChange = 0;

    public static void main(String[] args) {
        OperationResult<Document> res = service.listItems();
        System.out.println(res.getResult().getRootElement().getChildren());
        if (res.isSuccess()) {
            List<Element> itemList = res.getResult().getRootElement().getChildren();
            for (Element e : itemList) {
                testItemFromElement(e);
            }
        } else {
            System.out.println(res.getMessage());
        }
    }

    public static void testItemFromElement(Element e) {
        System.out.println(e.getChildText("itemID", NS));
        System.out.println(e.getChildText("itemName", NS));
        System.out.println(e.getChildText("itemURL", NS));
        System.out.println(e.getChildText("itemPrice", NS));
        System.out.println(e.getChildText("itemStock", NS));
        System.out.println(e.getChild("itemDescription", NS).getValue());
    }

    @GET
    @Path("items")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Item> getItems() {
        ArrayList<Item> items = new ArrayList<>();
        OperationResult<Document> res = service.listItems();
        if (res.isSuccess()) {
            List<Element> itemList = res.getResult().getRootElement().getChildren();
            for (Element e : itemList) {
                items.add(getItemFromElement(e));
            }
        } else {
            System.out.println(res.getMessage());
        }
        return items;
    }

    public Item getItemFromElement(Element e) {
        int id = Integer.parseInt(e.getChildText("itemID", NS));
        String name = e.getChildText("itemName", NS);
        String URL = e.getChildText("itemURL", NS);
        int price = Integer.parseInt(e.getChildText("itemPrice", NS));
        int stock = Integer.parseInt(e.getChildText("itemStock", NS));
        String description = e.getChild("itemDescription", NS).getValue();
        return new Item(id, name, URL, price, stock, description);
    }

    @POST
    @Path("login")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Customer login(Login login) {
        OperationResult<Document> result = service.login(login.getUsername(), login.getPassword());
        if (result.isSuccess()) {
            int id = Integer.parseInt(result.getResult().getRootElement().getChildText("customerID", NS));
            session.setAttribute("customerID", id);
            return new Customer(id, login.getUsername());
        } else {
            System.out.println(result.getMessage());
            return null;
        }
    }


    @GET
    @Path("getCart")
    @Produces(MediaType.APPLICATION_JSON)
    public ArrayList<Item> getCart() {
        if (session.getAttribute("cart") == null) {
            session.setAttribute("cart", new ArrayList<Item>());
        }
        return (ArrayList<Item>) session.getAttribute("cart");
    }

    @POST
    @Path("addToCart")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response addToCart(Item item) {
        ArrayList<Item> cart = getCart();
        cart.add(item);
        session.setAttribute("cart", cart);
        return Response.ok().build();
    }

    @POST
    @Path("sellItems")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Sale> sellItems() {
        ArrayList<Sale> sales = new ArrayList<>();
        ArrayList<Item> cart = getCart();
        if (session.getAttribute("customerID") != null) {
            int customerID = (int) session.getAttribute("customerID");
            for (Item i : cart) {
                OperationResult<Document> result = service.sellItems(i.getId(), customerID, 1);
                if (result.isSuccess()) {
                    sales.add(new Sale(true, result.getResult().getRootElement().getValue()));
                } else {
                    sales.add(new Sale(false, result.getMessage()));
                }
            }
        } else {
             sales.add(new Sale (false, "Please log in"));
        }
        return sales;
    }

    @POST
    @Path("signUp")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response signUp(Login login) {
        OperationResult<Document> result = service.login(login.getUsername(), login.getPassword());
        if(result.isSuccess()) {
            return Response.ok().build();
        } else {
            return Response.status(401).build();
        }
    }

    @GET
    @Path("items/manual")
    public String getItemsConstructedManually() {
        //You should get the items from the cloud server.
        //In the template we just construct some simple data as an array of objects
        //Here we output construct the JSON manually
        JSONArray array = new JSONArray();

        JSONObject jsonObject1 = new JSONObject();
        jsonObject1.put("id", 1);
        jsonObject1.put("name", "Stetson hat");
        jsonObject1.put("price", 300 + priceChange);
        array.put(jsonObject1);

        JSONObject jsonObject2 = new JSONObject();
        jsonObject2.put("id", 2);
        jsonObject2.put("name", "Rifle");
        jsonObject2.put("price", 500 + priceChange);
        array.put(jsonObject2);

        priceChange++;

        //You can create a MessageBodyWriter so you don't have to call toString() every time
        return array.toString();
    }


}
