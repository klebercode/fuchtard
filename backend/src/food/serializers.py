from rest_framework import serializers
from .models import FoodCategory, FoodItem


class FoodItemSerializer(serializers.ModelSerializer):
    price = serializers.SerializerMethodField()

    class Meta:
        model = FoodItem
        fields = (
            'id',
            'url',
            'slug',
            'visible',
            'enabled',
            'position',
            'title',
            'photo',
            'description',
            'raw_price',
            'category',
            # 'tags',
            'price',
            'amount',
        )

    def get_price(self, obj):
        return obj.price


class FoodItemMetaSerializer(serializers.ModelSerializer):
    price = serializers.SerializerMethodField()
    category = serializers.CharField(source='category.title')

    class Meta:
        model = FoodItem
        fields = (
            'id',
            'slug',
            'title',
            'photo',
            'raw_price',
            'price',
            'category',
            'amount',
        )

    def get_price(self, obj):
        return obj.price


class FoodCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodCategory
        fields = (
            'id',
            'url',
            'slug',
            'visible',
            'enabled',
            'position',
            'title',
        )
