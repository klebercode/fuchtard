from django.contrib import admin
from django.utils.html import format_html

from .models import Order, OrderDetails, Gift


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    exclude = ['deliver_at', 'cart']
    list_display = [
        'hashed_id',
        'order_created_timestamp',
        'name',
        'email',
        'phone',
        'street',
        'building',
        'apartment',
        'comment',
    ]


@admin.register(OrderDetails)
class OrderDetailsAdmin(admin.ModelAdmin):
    actions = None
    list_display = []
    fields = [
        'order_number',
        'order_created_timestamp',
        'name',
        'email',
        'phone',
        'street',
        'building',
        'apartment',
        'floor',
        'comment',
        'total',
        'gift_food_item',
        'cart_items',
    ]

    def get_readonly_fields(self, request, obj=None):
        return self.fields

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def order_number(self, obj):
        return format_html(
            '<a href="{}">{}</a>',
            obj.edit_url,
            obj.hashed_id,
        )
    order_number.short_description = 'Номер заказа'

    def total(self, obj):
        if obj.cart_meta:
            return '{} ₸'.format(obj.cart_meta['subtotal'])
    total.short_description = 'Итого'

    def cart_items(self, obj):
        if obj.cart_meta:
            return obj.cart_items
    cart_items.short_description = 'Корзина'


@admin.register(Gift)
class GiftAdmin(admin.ModelAdmin):
    list_display = ['food_item', 'requirement']
