//
//  CredentialProvider.h
//  CertificateProvider
//  Copyright (c) 2013 SAP. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@protocol CertificateProviderDelegate <NSObject>
//onsuccess callback delegete, the certificate should be saved locally to be returned by getCachedCertificate method later
-(void) onGetCertificateSuccess:(SecIdentityRef) aCertObject;

//onerror delegate
-(void) onGetCertificateFailure:(NSError *)error;

//ui helper method to get user input
//for aUIDefintion parameter, if its type is uiviewcontroller, then it is for native app. If it is NSUrl, it represents url to get the screen
//definition, if it is a string type, it is a html page path for kapsel app
-(BOOL) showUI:(id)aUIDefinition failedWithError:(NSError **)error;
@end

@protocol CertificateProvider <NSObject>

//asynchronous method to get a certificate, the delegate can be called to retrieve user input and return the result.
//The method first check and return the local saved certificate if available, before requesting the certificate from remote server
//report error to caller by calling onGetCertificateFailure delegate method
//return the certificate by calling onGetCertificateSuccess method, the certificate should be saved locally before calling
//onGetCertificateSuccess method
- (void) getCertificate:(id<CertificateProviderDelegate>) delegate;

//method to synchronously get a certificate from saved local copy
//if saved certicate exists, return true and also set the identityref parameter to the certificate
//If no saved certificate exists, return true and also setting identityRef parameter to nil.
//if error happens during getting the saved certificate, return false with related error, also setting identityRef parameter to nil
- (BOOL) getStoredCertificate:(SecIdentityRef *)identityRef error:(NSError**)anError;

//method to delete the saved local copy
//if not saved certificate exists, do nothing and return true,
//if saved certificate is deleted, return true
//if saved certificate exists and fails to delete, reture false with error
- (BOOL) deleteStoredCertificateWithError:(NSError**)anError;

@optional
//method to set required parameters input by user
//report error immediately by output reference,
//this errro will not cancel the getcertificate operation
- (BOOL) setParameters:(NSDictionary*)params failedWithError:(NSError **)error;

@end





