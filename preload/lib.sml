fun iter n s f = if n < 1 then s else iter (n - 1) (f s) f
fun iterdn m n s f = if m < n then s else iterdn (m - 1) n (f (m, s)) f
fun iterup m n s f = if m > n then s else iterup (m + 1) n (f (m, s)) f
fun first s p = if p s then s else first (s + 1) p
val foldl = foldl
