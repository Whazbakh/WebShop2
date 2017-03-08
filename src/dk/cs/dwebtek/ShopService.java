package dk.cs.dwebtek;

import dk.cs.au.dwebtek.CloudService;
import dk.cs.au.dwebtek.OperationResult;
import org.jdom2.Document;
import org.jdom2.Element;
import org.jdom2.Namespace;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
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

    @GET
    @Path("logOut")
    public Response logOut(){
        session.setAttribute("customerID", null);
        return Response.ok().build();
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
    @Path("cart")
    @Produces(MediaType.APPLICATION_JSON)
    public Collection<Item> getCart() {
        if (session.getAttribute("cart") == null) {
            session.setAttribute("cart", new HashMap<Integer, Item>());
        }
        HashMap<Integer, Item> cart = (HashMap<Integer, Item>) session.getAttribute("cart");
        return cart.values();
    }

    public HashMap<Integer, Item> getCartMap() {
        if (session.getAttribute("cart") == null) {
            session.setAttribute("cart", new HashMap<Integer, Item>());
        }
        return (HashMap<Integer, Item>) session.getAttribute("cart");
    }

    @POST
    @Path("addToCart")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public ShopResponse addToCart(Item item) {
        HashMap<Integer, Item> cart = getCartMap();
        int id = item.getId();
        if(cart.containsKey(id)) {
            Item i = cart.get(id);
            i.setAmount(i.getAmount()+1);
            cart.replace(id,i);
        } else {
            cart.put(item.getId(), item);
        }
        session.setAttribute("cart", cart);
        return new ShopResponse(true, "Item added to cart");
    }

    @GET
    @Path("emptyCart")
    public Response emptyCart(){
        session.setAttribute("cart", null);
        return Response.ok().build();
    }

    @POST
    @Path("sellItems")
    @Produces(MediaType.APPLICATION_JSON)
    public List<ShopResponse> sellItems() {
        ArrayList<ShopResponse> shopResponses = new ArrayList<>();
        Collection<Item> cart = getCartMap().values();
        if (session.getAttribute("customerID") != null) {
            int customerID = (int) session.getAttribute("customerID");
            for (Item i : cart) {
                OperationResult<Document> result = service.sellItems(i.getId(), customerID, i.getAmount());
                if (result.isSuccess()) {
                    Element response = result.getResult().getRootElement();
                    if(response.getChild("ok",NS)!=null) {
                        shopResponses.add(new ShopResponse(true, response.getValue()));
                    } else {
                        shopResponses.add(new ShopResponse(false, "Item " + i.getName() + " has insufficient stock"));
                    }
                } else {
                    shopResponses.add(new ShopResponse(false, result.getMessage()));
                }
            }
        } else {
             shopResponses.add(new ShopResponse(false, "Please log in. Did you think you could just buy stuff without telling me your name?"));
        }
        return shopResponses;
    }

    @POST
    @Path("signUp")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public ShopResponse signUp(Login login) {
        OperationResult<Document> result = service.createCustomer(login.getUsername(), login.getPassword());
        if(result.isSuccess()) {
            return new ShopResponse(true, "User" + login.getUsername()+ " created succesfully.");
        } else {
            return new ShopResponse(false, "Username already taken");
        }
    }
}
