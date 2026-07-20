// ShopStats.jsx

import {

Package,

Eye,

ShoppingBag,

MessageCircle

} from "lucide-react";

export default function ShopStats({shop}){

return(

<div className="mt-3 grid grid-cols-2 gap-2 text-xs">

<div>

<Package size={15}/>

{shop.productCount} Products

</div>

<div>

<ShoppingBag size={15}/>

{shop.totalSold} Sold

</div>

<div>

<Eye size={15}/>

{shop.views}

</div>

<div>

<MessageCircle size={15}/>

{shop.reviewCount} Reviews

</div>

</div>

)

}