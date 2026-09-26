"use client";

// Dynamic SweetAlert2 loader & Luxury VIP theme helpers

let swalPromise: Promise<any> | null = null;

export async function getSwal(): Promise<any> {
  if (typeof window === "undefined") return null;
  if ((window as any).Swal) return (window as any).Swal;

  if (swalPromise) return swalPromise;

  swalPromise = new Promise((resolve) => {
    // Inject Theme CSS if not present
    if (!document.getElementById("swal-theme-css")) {
      const link = document.createElement("link");
      link.id = "swal-theme-css";
      link.rel = "stylesheet";
      link.href = "https://cdn.jsdelivr.net/npm/@sweetalert2/theme-dark@4/dark.css";
      document.head.appendChild(link);
    }

    // Inject Script
    const existing = document.getElementById("swal-script");
    if (existing) {
      if ((window as any).Swal) {
        resolve((window as any).Swal);
      } else {
        existing.addEventListener("load", () => resolve((window as any).Swal));
      }
      return;
    }

    const script = document.createElement("script");
    script.id = "swal-script";
    script.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
    script.onload = () => {
      resolve((window as any).Swal);
    };
    document.head.appendChild(script);
  });

  return swalPromise;
}

export async function alertSuccess(title: string, message: string = "") {
  const Swal = await getSwal();
  if (!Swal) return;
  return Swal.fire({
    title,
    html: `<p class="text-neutral-300 text-sm mt-1">${message}</p>`,
    icon: "success",
    customClass: {
      popup: "vip-swal",
      confirmButton: "btn-primary",
    },
    buttonsStyling: false,
    confirmButtonText: "Grand Merci",
  });
}

export async function alertError(title: string, message: string = "") {
  const Swal = await getSwal();
  if (!Swal) return;
  return Swal.fire({
    title,
    html: `<p class="text-neutral-300 text-sm mt-1">${message}</p>`,
    icon: "error",
    customClass: {
      popup: "vip-swal",
      confirmButton: "btn-primary",
    },
    buttonsStyling: false,
    confirmButtonText: "Close",
  });
}

export async function alertConfirm(
  title: string,
  message: string,
  confirmButtonText: string = "Confirm",
  cancelButtonText: string = "Cancel"
): Promise<boolean> {
  const Swal = await getSwal();
  if (!Swal) return false;
  const result = await Swal.fire({
    title,
    html: `<p class="text-neutral-300 text-sm mt-1">${message}</p>`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    customClass: {
      popup: "vip-swal",
      confirmButton: "btn-primary !px-5 !py-2.5",
      cancelButton: "btn-secondary !px-5 !py-2.5",
    },
    buttonsStyling: false,
  });
  return result.isConfirmed;
}

export async function alertAddToCart({
  name,
  price,
  image,
}: {
  name: string;
  price: string | number;
  image?: string;
}) {
  const Swal = await getSwal();
  if (!Swal) return false;

  const displayPrice = typeof price === "number" ? `PKR ${price.toLocaleString()}` : price;

  const result = await Swal.fire({
    title: "Added to Your Bag",
    html: `
      <div class="flex items-center gap-4 p-3 my-2 rounded-xl bg-obsidian-800/80 border border-gold/30 text-left">
        ${
          image
            ? `<img src="${image}" alt="${name}" class="w-16 h-16 object-cover rounded-lg border border-gold/20 flex-shrink-0" />`
            : `<div class="w-16 h-16 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center text-gold font-serif">MC</div>`
        }
        <div class="flex-1 min-w-0">
          <p class="font-serif text-base text-gold-300 font-semibold truncate">${name}</p>
          <p class="text-xs text-neutral-400 mt-0.5">Luxury Eau de Parfum</p>
          <p class="text-sm font-semibold text-ivory mt-1">${displayPrice}</p>
        </div>
      </div>
      <p class="text-xs text-neutral-400 mt-2">Complimentary sample vials included with all orders.</p>
    `,
    showCancelButton: true,
    confirmButtonText: "View Bag & Checkout",
    cancelButtonText: "Continue Shopping",
    customClass: {
      popup: "vip-swal",
      confirmButton: "btn-primary !px-5 !py-2.5",
      cancelButton: "btn-secondary !px-5 !py-2.5",
    },
    buttonsStyling: false,
  });

  return result.isConfirmed;
}

export async function alertWishlist(name: string, added: boolean) {
  const Swal = await getSwal();
  if (!Swal) return;

  const toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    customClass: {
      popup: "vip-swal !py-3 !px-4 !rounded-xl !border-gold/50",
    },
  });

  toast.fire({
    icon: added ? "success" : "info",
    title: added ? `Added to Wishlist` : `Removed from Wishlist`,
    html: `<span class="text-xs text-neutral-300">${name}</span>`,
  });
}

export async function alertToast(title: string, type: "success" | "error" | "info" = "success") {
  const Swal = await getSwal();
  if (!Swal) return;

  const toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    customClass: {
      popup: "vip-swal !py-3 !px-4 !rounded-xl !border-gold/50",
    },
  });

  toast.fire({
    icon: type,
    title,
  });
}
