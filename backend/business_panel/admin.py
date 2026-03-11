from django.contrib import admin
from .models import Business, Message, MessageReply, Post, BusinessView


@admin.register(Business)
class BusinessAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'owner', 'verified', 'created_at']
    list_filter = ['category', 'verified', 'created_at']
    search_fields = ['name', 'description', 'owner__username']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['business', 'user', 'read', 'created_at']
    list_filter = ['read', 'created_at']
    search_fields = ['business__name', 'user__username', 'content']


@admin.register(MessageReply)
class MessageReplyAdmin(admin.ModelAdmin):
    list_display = ['message', 'created_at']
    search_fields = ['content']


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['title', 'business', 'type', 'active', 'created_at']
    list_filter = ['type', 'active', 'created_at']
    search_fields = ['title', 'content', 'business__name']


@admin.register(BusinessView)
class BusinessViewAdmin(admin.ModelAdmin):
    list_display = ['business', 'user', 'viewed_at']
    list_filter = ['viewed_at']
    search_fields = ['business__name']
